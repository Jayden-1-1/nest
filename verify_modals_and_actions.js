import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testModalsAndActions() {
  console.log('Testing Task Detail and Create Modals, and Persona switching...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Open Task Detail Modal by clicking a task row on dashboard
  console.log('Clicking task row on Dashboard...');
  const taskRow = await page.$('.divide-y > div');
  if (taskRow) {
    await taskRow.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'modal_task_detail.png' });
    console.log('Saved modal_task_detail.png');

    // Click close button or hit Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  } else {
    console.warn('Task row not found on dashboard');
  }

  // 2. Open Create Task Modal
  console.log('Opening Create Task Modal...');
  const createButtons = await page.$$('button');
  for (const btn of createButtons) {
    const text = await page.evaluate(e => e.textContent, btn);
    if (text.includes('ЗАПИСАТЬ НАМЕРЕНИЕ') || text.includes('RECORD NEW INTENTION')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: 'modal_task_create.png' });
      console.log('Saved modal_task_create.png');
      break;
    }
  }

  // 3. Close Create Modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 4. Test User Persona dropdown
  console.log('Opening User Persona dropdown...');
  const avatarButton = await page.$('header button img');
  if (avatarButton) {
    await avatarButton.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'dropdown_persona.png' });
    console.log('Saved dropdown_persona.png');
  }

  await browser.close();
  console.log('Modals and actions testing finished successfully!');
}

testModalsAndActions().catch(err => {
  console.error('Error in test:', err);
  process.exit(1);
});
