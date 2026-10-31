const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const fileUrl = `file://${path.resolve('test-katex.html')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  const html = await page.evaluate(() => document.getElementById('math-target').innerHTML);
  console.log(html);
  
  await browser.close();
})();
