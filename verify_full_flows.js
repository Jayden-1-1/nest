import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runComprehensiveQA() {
  console.log('--- Launching Chrome for Comprehensive QA ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => {
    console.error('Page error:', err.toString());
    errors.push(err.toString());
  });

  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
  console.log('Navigating to http://localhost:4173/...');
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Helper for clicking and waiting
  const clickNav = async (label) => {
    console.log(`Clicking navigation item containing: ${label}...`);
    const elements = await page.$$('aside nav button');
    for (const el of elements) {
      const text = await page.evaluate(e => e.textContent, el);
      if (text.includes(label)) {
        await el.click();
        await new Promise(r => setTimeout(r, 500));
        return true;
      }
    }
    throw new Error(`Nav item with label "${label}" not found`);
  };

  // 1. Check Tasks Page
  console.log('1. Testing Tasks Page...');
  await clickNav('ЗАДАЧИ');
  await page.screenshot({ path: 'screen_tasks.png' });
  console.log('Saved screen_tasks.png');

  // Test opening a task modal in Tasks Page
  const taskCards = await page.$$('button');
  let openedModal = false;
  for (const btn of taskCards) {
    const text = await page.evaluate(e => e.textContent, btn);
    if (text.includes('Exercise 347–350') || text.includes('MATHEMATICS')) {
      console.log('Clicking task card to open detail modal...');
      await btn.click();
      openedModal = true;
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  if (openedModal) {
    await page.screenshot({ path: 'screen_task_detail_modal.png' });
    console.log('Saved screen_task_detail_modal.png');
    // Close modal by pressing Escape or clicking close button
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // 2. Check Calendar Page
  console.log('2. Testing Calendar Page...');
  await clickNav('КАЛЕНДАРЬ');
  await page.screenshot({ path: 'screen_calendar.png' });
  console.log('Saved screen_calendar.png');

  // 3. Check Progress Page
  console.log('3. Testing Progress Page...');
  await clickNav('ПРОГРЕСС');
  await page.screenshot({ path: 'screen_progress.png' });
  console.log('Saved screen_progress.png');

  // 4. Check Activity Page
  console.log('4. Testing Activity / Chronicle Page...');
  await clickNav('ХРОНИКА');
  await page.screenshot({ path: 'screen_activity.png' });
  console.log('Saved screen_activity.png');

  // 5. Check Members Page
  console.log('5. Testing Members Page...');
  await clickNav('УЧАСТНИКИ');
  await page.screenshot({ path: 'screen_members.png' });
  console.log('Saved screen_members.png');

  // 6. Check Settings Page
  console.log('6. Testing Settings Page...');
  await clickNav('НАСТРОЙКИ');
  await page.screenshot({ path: 'screen_settings.png' });
  console.log('Saved screen_settings.png');

  // 7. Check Language Switcher (RU -> EN)
  console.log('7. Testing Language Switcher (RU -> EN)...');
  const langButtons = await page.$$('header button');
  for (const b of langButtons) {
    const text = await page.evaluate(e => e.textContent, b);
    if (text.trim() === 'RU') {
      await b.click();
      await new Promise(r => setTimeout(r, 500));
      console.log('Toggled language to EN');
      break;
    }
  }
  await page.screenshot({ path: 'screen_settings_en.png' });
  console.log('Saved screen_settings_en.png');

  // Navigate back to Home in EN
  console.log('Navigating back to HOME in English...');
  await clickNav('HOME');
  await page.screenshot({ path: 'screen_home_en.png' });
  console.log('Saved screen_home_en.png');

  // 8. Test Atmosphere switcher
  console.log('8. Testing Atmosphere Switcher...');
  const headerButtons = await page.$$('header button');
  for (const b of headerButtons) {
    const title = await page.evaluate(e => e.getAttribute('title'), b);
    if (title && (title.includes('Atmosphere') || title.includes('Атмосфера'))) {
      await b.click();
      await new Promise(r => setTimeout(r, 400));
      // Click Sunset or Ocean
      const dropdownBtns = await page.$$('div[class*="shadow-popover"] button');
      for (const db of dropdownBtns) {
        const text = await page.evaluate(e => e.textContent, db);
        if (text.includes('Sunset') || text.includes('Закат')) {
          await db.click();
          await new Promise(r => setTimeout(r, 500));
          console.log('Switched atmosphere to Sunset');
          break;
        }
      }
      break;
    }
  }
  await page.screenshot({ path: 'screen_sunset_atmosphere.png' });
  console.log('Saved screen_sunset_atmosphere.png');

  // Switch back to RU
  const enButtons = await page.$$('header button');
  for (const b of enButtons) {
    const text = await page.evaluate(e => e.textContent, b);
    if (text.trim() === 'EN') {
      await b.click();
      await new Promise(r => setTimeout(r, 500));
      console.log('Toggled language back to RU');
      break;
    }
  }

  console.log('All steps completed!');
  console.log('Errors encountered:', errors.length);
  if (errors.length > 0) {
    console.error(errors);
  } else {
    console.log('PERFECT RUN: 0 runtime errors detected across all flows!');
  }

  await browser.close();
}

runComprehensiveQA().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
