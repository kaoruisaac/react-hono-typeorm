# 請依序執行以下任務:

1. cd bin/i18n-agent
2. 執行 npm run scan
  - scan 的結果會列在 ./i18n/hits.json 裡
  - hits.json 裡描述的是在 {{file}} 的第 {{line}} 行，有個還沒定義的 {{key}}
3. 閱讀 {{file}} 的上下文，給予每個 {{key}} 合適的 zh-TW 及 en-US 文字
4. 整理成表格，表格的標頭為 key | en-US | zh-TW
