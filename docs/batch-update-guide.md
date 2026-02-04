# 批次更新動漫中文標題 - 使用說明

## 概述

使用 TMDB API 批次更新資料庫中動漫的中文標題。

## API 端點

### GET `/api/batch-update-titles`
查詢當前狀態

**回應範例：**
```json
{
  "success": true,
  "stats": {
    "total": 4618,
    "with_chinese": 98,
    "without_chinese": 4520,
    "percentage": "2.12%"
  }
}
```

### POST `/api/batch-update-titles`
執行批次更新（每次 20 筆）

**回應範例：**
```json
{
  "success": true,
  "message": "Processed 20 anime",
  "updated": 18,
  "failed": 2,
  "results": [...]
}
```

## 使用方式

### 方法一：使用測試腳本

```bash
node scripts/test-batch-update.js
```

### 方法二：直接調用 API

```bash
# 查看狀態
curl http://localhost:3001/api/batch-update-titles

# 執行更新
curl -X POST http://localhost:3001/api/batch-update-titles
```

### 方法三：在瀏覽器

1. 開啟 `http://localhost:3001/api/batch-update-titles` 查看狀態
2. 使用 Postman 或 Thunder Client 發送 POST 請求

## 批次處理建議

由於每次只處理 20 筆（避免超時），建議分批執行：

```bash
# 執行 10 次，處理 200 筆
for i in {1..10}; do
  echo "Batch $i"
  curl -X POST http://localhost:3001/api/batch-update-titles
  sleep 2
done
```

或使用 PowerShell：

```powershell
# 執行 10 次
1..10 | ForEach-Object {
  Write-Host "Batch $_"
  Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/batch-update-titles"
  Start-Sleep -Seconds 2
}
```

## 技術細節

### Rate Limiting
- 每次 TMDB API 調用之間強制等待 **300ms**
- 避免觸發 TMDB API 速率限制
- 處理 20 筆約需 10-15 秒

### 錯誤處理
- TMDB 找不到：標記為 `not_found`
- API 錯誤：標記為 `error`
- 已成功更新的不會重複處理

### 資料庫欄位
- `title`: 英文標題（用於查詢 TMDB）
- `title_chinese`: 中文標題（更新目標）

## 測試結果範例

```
=== Testing Batch Update API ===

1. Checking current status...
Current status:
  Total anime: 4618
  With Chinese: 80 (1.73%)
  Without Chinese: 4538

2. Starting batch update (20 anime)...

=== Update Complete ===
Success: true
Message: Processed 20 anime
Updated: 18
Failed: 2

Results:
  ✅ [1] Heroman → HEROMAN
  ✅ [2] Cobra The Animation → 眼鏡蛇
  ✅ [3] Sekirei: Pure Engagement → 鶺鴒女神
  ⚠️ [4] Bakugan Battle Brawlers: New Vestroia
  ...

3. Checking updated status...
New status:
  With Chinese: 98 (2.12%)
  Without Chinese: 4520

  Improvement: +18 titles
```

## 預計效果

- 每次執行：+15-19 筆（約 90% 成功率）
- 執行 10 次：約 +180 筆
- 執行 100 次：約 +1,800 筆
- **預估達到 50% 覆蓋率需要：約 120 次執行**

## 注意事項

1. **TMDB API KEY** 已內建在 `lib/tmdb.js`
2. **不會重複更新**：已有中文標題的會自動跳過
3. **建議分批執行**：避免一次性執行太久
4. **監控進度**：每次執行後查看改善幅度
