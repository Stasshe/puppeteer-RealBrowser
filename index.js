const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Puppeteerでページを取得し、リンクを書き換える
app.get('/fetch', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('Missing target URL');
        return;
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Puppeteerでページを開く
        await page.goto(targetUrl, { waitUntil: 'networkidle2' });

        // ページコンテンツを取得
        const html = await page.content();
        const $ = cheerio.load(html);

        const baseUrl = new URL(targetUrl); // ベースURLを取得

        $('a[href], link[href], script[src], img[src]').each((index, element) => {
            const attr = $(element).is('a, link') ? 'href' : 'src';
            let url = $(element).attr(attr);

            // URLが相対参照の場合は絶対URLに変換
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = new URL(url, baseUrl).href;
            }

            // 外部リンクまたは絶対URLに変換済みのリンクを置換
            if (url) {
                $(element).attr(attr, `/fetch?url=${encodeURIComponent(url)}`);
            }
        });
        await browser.close();

        // 書き換え後のHTMLを送信
        res.send($.html());
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching the page');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});