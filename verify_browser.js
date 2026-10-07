import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runQA() {
  console.log('Launching Chrome for Browser QA...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Desktop Test (1280x900)
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  console.log('Navigating to http://localhost:4173/...');
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Take Desktop Screenshot
  await page.screenshot({ path: 'screenshot_desktop.png' });
  console.log('Saved screenshot_desktop.png');

  // Verify elements
  const title = await page.title();
  console.log('Page title:', title);

  // Check if Alexey or heading exists
  const heading = await page.$eval('h1', el => el.textContent);
  console.log('Heading text:', heading);

  // 2. Mobile iPhone Test (390x844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.screenshot({ path: 'screenshot_iphone.png' });
  console.log('Saved screenshot_iphone.png');

  // Print any page errors or console logs
  console.log('Console logs count:', consoleLogs.length);
  if (errors.length > 0) {
    console.error('Page errors detected:', errors);
  } else {
    console.log('Zero page errors! 100% clean runtime execution.');
  }

  await browser.close();
}

runQA().catch(err => {
  console.error('QA script error:', err);
  process.exit(1);
});
