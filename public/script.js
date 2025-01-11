document.getElementById('proxyForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;

    const response = await fetch('/proxy?url=' + encodeURIComponent(url));

    const result = await response.text();
    document.getElementById('result').srcdoc = result;
});