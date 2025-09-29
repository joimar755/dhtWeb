import express from 'express'
import http from 'http';
import cors from "cors";
import { Server as SocketIOServer } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = 3000
app.use(express.static('public'));


const nombres = ['joimar', 'juan', 'carlos'];

io.on('connection', (socket) => {
    console.log("conexion", socket.id);
    
})

app.get('/', (req, res) => {

    res.send(nombres)
})
app.post('/', (req, res) => {
    const { aux } = req.body
    nombres.push(aux)
    console.log(nombres);
    res.send(nombres)
})
app.post('/send_dht', (req, res) => {
    try {
        const { temperatura, humedad } = req.body
        console.log("temperatura", temperatura, "humedad", humedad, "%");
        io.emit("sensorData", { temperatura, humedad });
        return res.json({ ok: true, temperatura, humedad });

    } catch (error) {
        // Responder solo si NO se ha enviado antes
        if (!res.headersSent) {
            return res.status(500).json({ error: "Error interno" });
        }
    }

})




server.listen(port, "0.0.0.0", () => {
    console.log("🚀 Servidor corriendo en http://0.0.0.0:3000");
})
