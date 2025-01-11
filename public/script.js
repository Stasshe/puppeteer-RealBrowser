// script.js
document.getElementById('proxyForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;

    const response = await fetch('/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUrl: url })
    });

    const result = await response.text();
    document.getElementById('result').srcdoc = result;
});