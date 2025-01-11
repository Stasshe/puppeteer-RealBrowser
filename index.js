const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const url = require('url');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/fetch', async (req, res) => {
    const { targetUrl } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(targetUrl);

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching the page');
    }
});

// プロキシサーバーの設定
app.use('/proxy', (req, res) => {
    const targetUrl = req.query.url;
    const parsedUrl = url.parse(targetUrl);
    
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: req.method,
        headers: req.headers
    };

    const proxyRequest = http.request(options, (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(res, { end: true });
    });

    req.pipe(proxyRequest, { end: true });
    proxyRequest.on('error', (e) => {
        console.error(e);
        res.status(500).send('Proxy error');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});