const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=プロキシサーバーのアドレス']
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');

    // 追加の操作をここに記述
    
    await browser.close();
})();
