# Smart Dormitory Stable

这是为 Vercel + Supabase + ESP32 远程访问重构后的智能宿舍系统。

## 这版解决的问题

- 去掉 `globalThis` 内存状态，所有状态进入 Supabase。
- 不再混用中文表名和英文表名，避免 schema cache 和字段名错误。
- `/api/device-command` 返回 `{ data: { control, config } }`，适配 ESP32 轮询逻辑。
- 前端数据加载使用超时和容错，不会因为接口失败白屏。
- ESP32 网络补丁支持 Vercel HTTPS 域名远程访问。

## 目录

```txt
app/                  Next.js App Router
app/api/              Serverless API
lib/types.ts          前后端共享类型
supabase/schema.sql   Supabase 初始化 SQL
esp32_patch/          ESP32 网络远程访问补丁
```

## 部署步骤

### 1. Supabase 建表

打开 Supabase → SQL Editor → 执行：

```sql
-- 复制执行 supabase/schema.sql 的全部内容
```

### 2. Vercel 环境变量

在 Vercel Project → Settings → Environment Variables 添加：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DORM_LOGIN_USER=admin
DORM_LOGIN_PASSWORD=123456
DEVICE_API_TOKEN=
```

`DEVICE_API_TOKEN` 可以先留空。若设置了，ESP32 必须发送同样的 `x-device-token` 请求头。

### 3. 推送部署

```bash
npm install
npm run build
git add .
git commit -m "stable smart dormitory refactor"
git push
```

### 4. 测试接口

```txt
https://你的域名.vercel.app/api/health
https://你的域名.vercel.app/api/device-command
https://你的域名.vercel.app/api/sensor-data
```

### 5. ESP32 远程访问

原工程里 `NET_API_BASE` 默认是局域网地址，只能访问本地电脑。部署后请改为：

```ini
build_flags =
  -D NET_WIFI_SSID=\"你的WiFi\"
  -D NET_WIFI_PASS=\"你的密码\"
  -D NET_API_BASE=\"https://你的域名.vercel.app\"
```

如果 HTTPS 请求失败，把 `esp32_patch/net.cpp` 复制替换原工程的：

```txt
src/interface/net/net.cpp
```

## API 说明

### `GET /api/device-command`

ESP32 轮询读取，返回：

```json
{
  "success": true,
  "data": {
    "control": {
      "mode": "auto",
      "light": false,
      "fan": false,
      "fan_speed": 0,
      "socket": false,
      "sleep_mode": false
    },
    "config": {
      "mq2Threshold": 1800,
      "co2Threshold": 1200,
      "powerThreshold": 10,
      "minTemperature": 0,
      "maxTemperature": 40,
      "fanOnTemperature": 30,
      "fanOffTemperature": 28,
      "lightThreshold": 20,
      "shortAwaySeconds": 30,
      "longAwaySeconds": 1800
    }
  }
}
```

### `POST /api/sensor-data`

ESP32 上传传感器数据，兼容原工程中的字段：

```json
{
  "device_id": "smart-dorm-001",
  "temperature": 26.5,
  "humidity": 60,
  "lux": 120,
  "mq2": 300,
  "co2": 650,
  "power": 8.6,
  "light": true,
  "fan": false,
  "fan_speed": 0,
  "socket": true,
  "person_detected": true,
  "face_name": "WXC"
}
```

## 重要提醒

正式项目中不要长期使用 `setInsecure()`；这是为了课程设计/毕设演示快速支持 HTTPS。产品化应使用 CA 证书校验。
