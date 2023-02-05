"use strict";

const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const host = process.env.UI_HOST || "0.0.0.0";
const port = process.env.UI_PORT || 8000;

async function sendFile(res, filename, type) {
    try {
        const data = await fs.readFile(filename);
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    } catch (e) {
        res.statusCode = 404;
        res.end();
    }
}

function main() {

    const requestListener = async (req, res) => {
        switch(req.url) {
            case "/":
                await sendFile(res, path.join(__dirname, "index.html"), "text/html");
                break;
            case "/public/css/bulma.min.css":
                await sendFile(res, path.join(__dirname, "public", "css", "bulma.min.css"), "text/css");
                break;
            case "/public/js/request.js":
                await sendFile(res, path.join(__dirname, "public", "js", "request.js"), "text/js");
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/html" })
                res.end("<html><h1>404 - Not Found</h1></html>");
        }

    };

    const server = http.createServer(requestListener);

    server.listen(port, host, () => {
        console.log(`Server on! http://${host}:${port}`);
    });
}

main()