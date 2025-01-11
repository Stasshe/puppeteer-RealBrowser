const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const url = require('url');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// プロキシサーバーの設定
app.use('/proxy', (req, res) => {
    const targetUrl = req.query.url;
    const parsedUrl = url.parse(targetUrl);
    const isHttps = parsedUrl.protocol === 'https:';
    
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.path,
        method: req.method,
        headers: req.headers
    };

    const proxyRequest = (isHttps ? https : http).request(options, (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(res, { end: true });
    });

    req.pipe(proxyRequest, { end: true });
    proxyRequest.on('error', (e) => {
        console.error(e);
        res.status(500).send('Proxy error');
    });
});

app.post('/fetch', async (req, res) => {
    const { targetUrl } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(targetUrl);

        // ターゲットURLのホスト名を取得
        const targetHost = new URL(targetUrl).hostname;

        // ページのコンテンツを取得
        let content = await page.content();

        // HTMLのリンクやリソースをプロキシ経由に書き換え
        content = content.replace(/(href|src)=["'](.*?)["']/g, (match, p1, p2) => {
            try {
                const resourceUrl = new URL(p2, targetUrl);
                if (resourceUrl.hostname === targetHost) {
                    return `${p1}="/proxy?url=${encodeURIComponent(resourceUrl.href)}"`;
                }
            } catch (e) {
                // URLの解析に失敗した場合は無視する
                return match;
            }
            return match;
        });

        await browser.close();

        res.send(content);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching the page');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});