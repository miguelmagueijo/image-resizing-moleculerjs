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
    const API_PORT = process.env.API_PORT;
    const htmlPath = path.join(__dirname, "index.html")
    const jsPath = path.join(__dirname, "public", "js", "request.js");
    const cssPath = path.join(__dirname, "public", "css", "bulma.min.css");

    if (!isNaN(Number(API_PORT))) {~
        console.log(`API port changed! New port: ${API_PORT}`);
        fs.readFile(jsPath, (err, data) => {
            if (err) {
                console.error(err);
                throw new Error("Something went wrong while opening request.js.");
            }

            const finalFile = data.replace(/http:\/\/127.0.0.1:3000\/api\/image/g, `http://127.0.0.1:${API_PORT}/api/image`);

            fs.writeFile(jsPath, finalFile, "utf8", (err) => {
                if (err) {
                    console.error(err);
                    throw new Error("Something went wrong while saving request.js");
                }
            })
        });
    }

    const requestListener = async (req, res) => {
        switch(req.url) {
            case "/":
                await sendFile(res, htmlPath, "text/html");
                break;
            case "/public/css/bulma.min.css":
                await sendFile(res, cssPath, "text/css");
                break;
            case "/public/js/request.js":
                await sendFile(res, jsPath, "text/javascript");
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