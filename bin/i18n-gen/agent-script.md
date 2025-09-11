
#### The following steps will generate the [pending-update.json](bin/i18n-gen/i18n/pending-update.json) file, which describes undefined i18n keys. You need to complete the i18n translations and organize them into a table. First, read all the JSON files under [locales](public/locales) as reference for your translations.

### Please follow these steps in order:

1. Run cd bin/i18n-gen && npm run scan
    - The scan result will be listed in bin/i18n-gen/i18n/pending-update.json
2. Read bin/i18n-gen/i18n/pending-update.json
    - Interpret {{target}}, {{line}}, and {{key}} as variable placeholders whose values come from the JSON object fields.
3. Read the context of {{target}}, and provide appropriate en-US, zh-TW, and zh-CN translations for each {{key}}
4. If {{key}} is not in English hyphen-case and also lowercase, change {{key}} to a suitable English hyphen-case
5. Update the above key changes in {{target}} files, but DO NOT update the translation resource files under [locales](public/locales)
6. Organize the results into a table with the headers: key | en-US | zh-TW | zh-CN
7. Delete the [bin/i18n-gen/i18n](bin/i18n-gen/i18n) folder



##### definitions:
  target: "The file path or filename where the undefined i18n key is found. Always refer to the string value in pending-update.json['target']."
  line: "The line number in the target file where the key appears. Always use the numeric value in pending-update.json['line']."
  key: "The i18n key itself that is missing translation. Always use the string in pending-update.json['key']."
  pending-update.json:
    [
        {
            "target": "src/components/Button.tsx",
            "line": 42,
            "key": "submit"
        }
    ]
    - When I say "target" → it refers to "src/components/Button.tsx"
    - When I say "line" → it refers to 42  
    - When I say "key" → it refers to "submit"