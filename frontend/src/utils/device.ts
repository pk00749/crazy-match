const DEVICE_ID_KEY = 'crazy_match_device_id'

export async function getDeviceId(): Promise<string> {
  // 检查缓存
  const cached = localStorage.getItem(DEVICE_ID_KEY)
  if (cached) return cached

  // 生成新的 device ID (简化版，实际应使用 fingerprint.js)
  const deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
  localStorage.setItem(DEVICE_ID_KEY, deviceId)

  return deviceId
}