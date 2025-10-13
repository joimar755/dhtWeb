export const post_temp = (req, res, io) => {
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
 }