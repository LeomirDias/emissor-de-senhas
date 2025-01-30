require("dotenv").config(); // Carrega as variáveis de ambiente do .env

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const os = require("os");
const fetch = require("node-fetch"); // Importando o fetch

const app = express();
const port = process.env.PORT || 3001; // Define a porta que a API rodará

// Descobre o IP local para exibição no log
const localIP = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface.family === "IPv4" && !iface.internal)?.address || "127.0.0.1";

// Lista de origens permitidas
const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://10.0.1.16", // IP da VM primária
    "http://172.16.200.66" // IP da VM secundária
]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || [...allowedOrigins].some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usando as rotas
app.use("/api", queueRoutes);

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error("Erro inesperado:", err.stack);
    res.status(500).json({ error: "Erro interno do servidor" });
});

// Criar o servidor HTTP
const server = http.createServer(app);

// Criar o WebSocket
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Cliente WebSocket conectado!");

    ws.on("message", (message) => {
        console.log("Mensagem recebida via WebSocket:", message);
        let url = "";

        if (message === "add-general") {
            url = `http://10.0.1.16:3001/api/add-general`; // Conexão com a aplicação primária
        } else if (message === "add-preferential") {
            url = `http://10.0.1.16:3001/api/add-preferential`; // Conexão com a aplicação primária
        }

        if (url) {
            fetch(url, { method: "POST" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro HTTP! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => console.log("Resposta da API:", data))
                .catch(error => console.error("Erro ao fazer requisição:", error.message));
        }
    });

    ws.on("close", () => {
        console.log("Cliente WebSocket desconectado.");
    });
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando em:`);
    console.log(`- Local: http://localhost:${port}`);
    console.log(`- Rede: http://${localIP}:${port}`);
    console.log(`Servidor WebSocket rodando na mesma porta ${port}`);
});

// Exibindo o ano atual no footer
document.getElementById("year").textContent = new Date().getFullYear();