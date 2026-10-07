import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testLightMode() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Toggle theme button
  const themeBtns = await page.$$('header button');
  for (const b of themeBtns) {
    const title = await page.evaluate(e => e.getAttribute('title'), b);
    if (title && (title.includes('Warm Paper') || title.includes('Midnight'))) {
      await b.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  await page.screenshot({ path: 'screen_light_mode.png' });
  console.log('Saved screen_light_mode.png');

  await browser.close();
}

testLightMode().catch(console.error);
