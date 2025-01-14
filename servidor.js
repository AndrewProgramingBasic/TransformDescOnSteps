const http = require('http');
const requestHandler = require('./HandlerPetition/requestHandler');
const staticHandler = require('./HandlerPetition/staticHandler');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
    // Configuración de CORS (siempre al principio)
    res.setHeader('Access-Control-Allow-Origin', '*'); // NO USAR EN PRODUCCIÓN
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`); // Usar URL para parsear
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST' && pathname === '/gemini') {
        await requestHandler.handleGeminiRequest(req, res);
    } else {
        staticHandler.handleStaticRequest(req, res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}/`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${port} ya está en uso. Cierra la otra instancia o elige otro puerto.`);
    } else {
        console.error("Error al iniciar el servidor:", err);
    }
});