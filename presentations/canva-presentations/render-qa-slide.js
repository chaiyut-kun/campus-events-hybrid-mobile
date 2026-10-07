const { chromium } = require('playwright-chromium');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Campus Events — Q&A</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1920px;
      height: 1080px;
      background: #fbf8fc;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient gentle pastel wash */
    .ambient-top {
      position: absolute;
      top: -150px;
      left: -150px;
      width: 650px;
      height: 650px;
      border-radius: 50%;
      background: rgba(198, 183, 255, 0.35);
      filter: blur(100px);
      pointer-events: none;
    }

    .ambient-bottom {
      position: absolute;
      bottom: -150px;
      right: -150px;
      width: 650px;
      height: 650px;
      border-radius: 50%;
      background: rgba(29, 191, 115, 0.22);
      filter: blur(100px);
      pointer-events: none;
    }

    .qa-heading {
      font-size: 140px;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #1b1b1e;
      z-index: 10;
      text-align: center;
      line-height: 1;
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="ambient-top"></div>
  <div class="ambient-bottom"></div>
  <h1 class="qa-heading">Q&A</h1>
</body>
</html>`;

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  const outputPath = path.join(__dirname, 'qa-slide.png');
  await page.screenshot({ path: outputPath, fullPage: true });

  console.log(`Minimal Q&A slide rendered successfully to: ${outputPath}`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
