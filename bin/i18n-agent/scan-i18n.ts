import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import fs from "fs";
import fse from "fs-extra";
import { glob } from "glob";
import { Hit } from "./types";

const isKey = (v: unknown) => typeof v === "string" && v.length > 0;

const CALL_NAMES = new Set([
  "t",                 // t('key')
  "i18n.t",            // i18n.t('key')
  "i18next.t",         // i18next.t('key')
  "formatMessage",     // intl.formatMessage({id: 'key'})
]);

function extractCallExpr(node: any): string | null {
  // t('key')
  if (node.callee?.type === "Identifier" && CALL_NAMES.has(node.callee.name)) {
    const arg0 = node.arguments?.[0];
    if (arg0?.type === "StringLiteral" && isKey(arg0.value)) return arg0.value;
  }
  // i18n.t('key') / i18next.t('key')
  if (node.callee?.type === "MemberExpression") {
    const obj = node.callee.object;
    const prop = node.callee.property;
    const calleeName = (obj?.name || obj?.object?.name || "") + "." + (prop?.name || "");
    if (CALL_NAMES.has(calleeName)) {
      const arg0 = node.arguments?.[0];
      if (arg0?.type === "StringLiteral" && isKey(arg0.value)) return arg0.value;
    }
  }
  return null;
}

function extractFormatMessage(node: any): string | null {
  // intl.formatMessage({ id: 'key' })
  if (node.callee?.type === "MemberExpression") {
    const prop = node.callee.property;
    if (prop?.name === "formatMessage") {
      const arg0 = node.arguments?.[0];
      if (arg0?.type === "ObjectExpression") {
        const idProp = arg0.properties.find((p: any) => p.key?.name === "id" || p.key?.value === "id");
        if (idProp?.value?.type === "StringLiteral") return idProp.value.value;
      }
    }
  }
  return null;
}

function extractTransJSX(node: any): string | null {
  // <Trans i18nKey="key" />
  if (node.openingElement?.name?.name === "Trans") {
    const attr = node.openingElement.attributes.find(
      (a: any) => a.name?.name === "i18nKey"
    );
    if (attr?.value?.type === "StringLiteral") return attr.value.value;
  }
  return null;
}

(async () => {
  const files = await glob(["../../app/**/*.{ts,tsx,js,jsx}"], {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"]
  });

  const hits: Hit[] = [];

  for (const file of files) {
    const code = fs.readFileSync(file, "utf8");
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    traverse(ast, {
      enter(p) {
        const n: any = p.node;

        if (n.type === "CallExpression") {
          const k1 = extractCallExpr(n);
          if (k1) hits.push({ key: k1, file, line: n.loc?.start.line ?? 0 });
          const k2 = extractFormatMessage(n);
          if (k2) hits.push({ key: k2, file, line: n.loc?.start.line ?? 0 });
        }

        if (n.type === "JSXElement") {
          const k3 = extractTransJSX(n);
          if (k3) hits.push({ key: k3, file, line: n.openingElement.loc?.start.line ?? 0 });
        }
      }
    });
  }

  // get all existed keys from public/locales/*.json
  const locales = await glob("../../public/locales/en-US/*.json");
  const existedKeys = new Set<string>();
  for (const locale of locales) {
    const data = JSON.parse(fs.readFileSync(locale, "utf8"));
    for (const key in data) {
      existedKeys.add(key);
    }
  }

  // 去重
  const seen = new Set<string>();
  const unique = hits.filter((h) => !existedKeys.has(h.key));

  await fse.ensureDir("i18n");
  // 輸出 CSV 與 JSON
  const csv = ["key,file,line"].concat(unique.map(h => `${h.key},${h.file},${h.line}`)).join("\n");
  fs.writeFileSync("i18n/missing.csv", csv, "utf8");
  fs.writeFileSync("i18n/hits.json", JSON.stringify(unique, null, 2), "utf8");

  console.log(`✅ Found ${unique.length} usages. See i18n/missing.csv`);
})();