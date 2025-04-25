import { test, expect } from '@playwright/test'

test.describe('Quote Creation Flow', () => {
  test('should be able to add a packet to a quote', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/dashboard')
    
    // Navigate to packets page
    await page.click('text=Packets')
    
    // Wait for packets to load
    await page.waitForSelector('h1:has-text("Packets")')
    
    // Assuming there's at least one packet
    if (await page.isVisible('text=No packets yet')) {
      // Create a packet if none exists
      await page.click('button:has-text("Add Packet")')
      await page.fill('input[name="name"]', 'Test Packet')
      await page.fill('textarea[name="description"]', 'Test Description')
      await page.click('button:has-text("Add Packet")')
      
      // Wait for the packet to be created
      await page.waitForSelector('text=Test Packet')
    }
    
    // Select the first packet
    await page.click('.packet-row >> nth=0 >> button:has-text("Add to Quote")')
    
    // Navigate to quotes page
    await page.click('text=Quotes')
    
    // Verify packet is in the cart
    await page.waitForSelector('.cart-item')
    
    // Customize the packet (change markup)
    await page.fill('.cart-item >> input[name="markupPercentage"]', '30')
    
    // Generate quote
    await page.click('button:has-text("Generate Quote")')
    
    // Verify quote is generated
    await page.waitForSelector('text=Quote Details')
    
    // Verify PDF button is visible
    await expect(page.locator('button:has-text("Download PDF")')).toBeVisible()
  })
}) 