const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function handleGeminiRequest(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    return new Promise((resolve, reject) => {
        req.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                const prompt = `Deber generarme los siguientes dos elementos

                "operacion" y "proceso enviado", a partir de lo siguiente:
                ${jsonData.description}


                Un ejemplo de como lo realizaras es el siguiente:

                Segun esta descripcion:

                Acceder a la sección “Control de Clientes” o presionar

                el botón “Entrar consulta” en la pestaña clientes de dicha sección, se

                evidencia que el sistema en el campo “Tipo de Identificación” despliega

                correctamente la lista de tipos de identificación (Gobierno, Comuna, Jurídico,

                Menor, Pasaporte, venezolano Y Extranjero).

                Se genera esto:

                **Operación**

                1.- Seleccionar el módulo suscripción

                2.- seleccionar el sub modulo control de clientes

                3.- Seleccionar el botón entrar consulta

                4.- Seleccionar campo tipo id

                **Proceso enviado**

                1.- Presionar suscripciones

                2.- presionar el botón control de clientes

                3.- Presionar el botón entrar consulta

                4.- Presionar el botón tipo id`;

                try {
                    const result = await model.generateContent(prompt);
                    const geminiResponse = result.response.text();

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: "Petición POST recibida y procesada con Gemini.",
                        geminiResponse: geminiResponse,
                        receivedData: jsonData
                    }));
                } catch (geminiError) {
                    console.error("Error al generar respuesta con Gemini:", geminiError);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error al procesar la solicitud con Gemini.", geminiError: geminiError.message }));
                }
            } catch (error) {
                console.error("Error al parsear JSON:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "JSON inválido en el cuerpo de la petición." }));
            }
            resolve(); // Resuelve la promesa al final del procesamiento
        });
        req.on('error', (err) => {
            reject(err)
        })
    });
}

module.exports = { handleGeminiRequest };