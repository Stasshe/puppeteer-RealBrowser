require('dotenv').config();
const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  const codespaceUrl = process.env.CODESPACE_URL;
  const seleniumUrl = `https://opulent-space-enigma-qwg94575v7vc9jv5-4444.app.github.dev/wd/hub`;

  let driver = await new Builder().forBrowser('chrome').usingServer(seleniumUrl).build();

  try {
    await driver.get('http://localhost:3000');

    // 必要な操作を記述
    await driver.findElement(By.name('q')).sendKeys('Hello World', Key.RETURN);
    await driver.wait(until.titleIs('Hello World - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();
