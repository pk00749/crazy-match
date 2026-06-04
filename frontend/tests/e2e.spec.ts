import { test, expect } from '@playwright/test'

test.describe('Crazy Match E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage loads correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Crazy Match')
  })

  test('navigation works', async ({ page }) => {
    await page.click('text=赛程')
    await expect(page).toHaveURL(/.*schedule/)
  })

  test('today page shows date', async ({ page }) => {
    await expect(page.locator('.today-header h2')).toBeVisible()
  })

  test('api proxy works - teams endpoint', async ({ page }) => {
    const response = await page.request.get('/api/teams')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('api proxy works - matches endpoint', async ({ page }) => {
    const response = await page.request.get('/api/matches')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('api proxy works - predict endpoint', async ({ page }) => {
    const response = await page.request.post('/api/predict', {
      data: { team_a_id: 'BRA', team_b_id: 'ARG' }
    })
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.win_probability).toBeDefined()
  })
})

test.describe('Schedule Page', () => {
  test('schedule page loads with tabs', async ({ page }) => {
    await page.goto('/schedule')
    await expect(page.locator('.stage-tabs')).toBeVisible()
    await expect(page.locator('text=小组赛')).toBeVisible()
    await expect(page.locator('text=16强')).toBeVisible()
  })

  test('tab switching works', async ({ page }) => {
    await page.goto('/schedule')
    await page.click