import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

const routes = {
  "/": "index.html",
  "/end-of-tenancy-cleaning": "end-of-tenancy-cleaning.html",
  "/end-of-tenancy-cleaning/": "end-of-tenancy-cleaning.html",
};

createServer((request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const requestPath = routes[pathname] ?? pathname.replace(/^\/+/, "");
  const filePath = join(root, requestPath);

  response.setHeader("Content-Type", mimeTypes[extname(filePath)] ?? "application/octet-stream");
  createReadStream(filePath)
    .on("error", () => {
      response.statusCode = 404;
      response.end("Not found");
    })
    .pipe(response);
}).listen(4173, "127.0.0.1");
