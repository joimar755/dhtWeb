import express from 'express'
import http from 'http';
import cors from "cors";
import { Server as SocketIOServer } from 'socket.io';
import TempRoutes from './routes/dht.routes.js'
import AuthRoutes from './routes/auth.routes.js'
import Leds_Routes from './routes/leds.routes.js'


const app = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server, { cors: { origin: '*' } });
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(TempRoutes);
app.use(AuthRoutes);
app.use(Leds_Routes);


const port = 3000
app.use(express.static('public'));


export const ledStatus = { led1: false, led2: false, led3: false };

io.on('connection', (socket) => {
    console.log("conexion", socket.id);
    socket.emit("control", ledStatus);
})

app.get('/', (req, res) => {

    res.send(nombres)
})
/*
app.get("/leds", (req, res) => {
    res.json(ledStatus);
});
*/
/*
app.post("/leds", (req, res) => {
    ledStatus = req.body;
    io.emit("control", ledStatus);
    console.log("Nuevo estado:", { ledStatus });
    return res.json({ success: true, status: ledStatus });
});
*/
/*
app.post('/send_dht', (req, res) => {
    try {
        let { temperatura, humedad, ms } = req.body
        if (!ms) ms = Date.now();
        const fecha = new Date(ms);
        const hora = fecha.toLocaleString();
        console.log("temperatura:", temperatura, "humedad:", humedad, "%", "hora:", hora);
        io.emit("sensorData", { temperatura, humedad, hora });
        return res.json({ ok: true, temperatura, humedad, hora});
    } catch (error) {
        // Responder solo si NO se ha enviado antes
        if (!res.headersSent) {
            return res.status(500).json({ error: "Error interno" });
        }
    }

})
*/




server.listen(port, "0.0.0.0", () => {
    console.log("🚀 Servidor corriendo en http://0.0.0.0:3000");
})
