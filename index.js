const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/fetch', async (req, res) => {
    const { url } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--proxy-server=プロキシサーバーのアドレス']
        });

        const page = await browser.newPage();
        await page.goto(url);

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        res.status(500).send('Error fetching the page');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
