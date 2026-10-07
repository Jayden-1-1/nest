import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTaskFlow() {
  console.log('Testing Task Detail, Creation, and Status changes...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Open Task Detail modal by clicking "Exercise 347–350"
  console.log('1. Clicking Exercise 347–350 in Next Up Spotlight...');
  const h2Elements = await page.$$('h2');
  for (const h2 of h2Elements) {
    const text = await page.evaluate(e => e.textContent, h2);
    if (text.includes('Exercise 347–350')) {
      await h2.click();
      await new Promise(r => setTimeout(r, 600));
      console.log('Clicked! Saving modal_task_detail.png...');
      await page.screenshot({ path: 'modal_task_detail.png' });
      break;
    }
  }

  // Close modal with Escape
  console.log('Closing detail modal...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 2. Open Create Task modal
  console.log('2. Clicking "Записать намерение" / Create Task...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(e => e.textContent.toLowerCase(), btn);
    if (text.includes('намерение') || text.includes('intention') || text.includes('создать задачу')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      console.log('Create Task Modal opened! Saving modal_task_create.png...');
      await page.screenshot({ path: 'modal_task_create.png' });
      break;
    }
  }

  // Fill in Task Title
  console.log('Filling in new task form...');
  const titleInput = await page.$('input[type="text"]');
  if (titleInput) {
    await titleInput.type('Organic Chemistry Lab Synthesis');
  }

  // Click Submit / Опубликовать
  const modalButtons = await page.$$('div[role="dialog"] button, div.fixed button');
  for (const btn of modalButtons) {
    const text = await page.evaluate(e => e.textContent.toLowerCase(), btn);
    if (text.includes('опубликовать') || text.includes('создать') || text.includes('publish') || text.includes('save')) {
      console.log('Submitting new task...');
      await btn.click();
      await new Promise(r => setTimeout(r, 700));
      break;
    }
  }

  await page.screenshot({ path: 'screen_after_task_created.png' });
  console.log('Saved screen_after_task_created.png');

  // 3. Test Persona switcher
  console.log('3. Testing Persona Dropdown...');
  const headerAvatars = await page.$$('header div.relative button');
  for (const b of headerAvatars) {
    const imgOrIcon = await b.$('img, svg');
    if (imgOrIcon) {
      await b.click();
      await new Promise(r => setTimeout(r, 400));
      const popover = await page.$('div.shadow-popover');
      if (popover) {
        console.log('Found popover! Saving dropdown_persona.png...');
        await page.screenshot({ path: 'dropdown_persona.png' });
        break;
      }
    }
  }

  await browser.close();
  console.log('All tests completed successfully!');
}

testTaskFlow().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
