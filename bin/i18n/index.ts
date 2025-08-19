/* eslint-disable no-unused-vars */
import { writeFile } from 'fs';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { GoogleAuth } from 'google-auth-library';

const exec = async () => {
  process.stdout.write(`\nLoading sheets from google... `);
  const auth = new GoogleAuth({
    keyFile: './<IAM_FILE_NAME>.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const doc = new GoogleSpreadsheet('<SHEET_ID>', auth);
  await doc.loadInfo();
  await genI18n(doc.sheetsByIndex);
  process.stdout.write(`\nDone`);

}

const genI18n = async (i18nMappingSheets: GoogleSpreadsheetWorksheet[]) => {
  process.stdout.write('\n');
  const results = {};
  await Promise.all(i18nMappingSheets.map(async (spreadsheet) => {
    await spreadsheet.loadHeaderRow();
    const keyStr = spreadsheet.headerValues[0];
    const langs = spreadsheet.headerValues.slice(1);
    const rows = await spreadsheet.getRows();
    rows.forEach((row) => {
      langs.forEach((lang) => {
        results[lang] = results[lang] || {};
        results[lang][row.get(keyStr)] = row.get(lang);
      })
    });
  }));
  await Promise.all(
    Object.keys(results).map((lang) => {
      return new Promise((r) => writeFile(`../../server/public/locales/${lang}/translation.json`, JSON.stringify(results[lang]), () => r(true)));
    }),
  );
  console.log(results);
}


exec();
