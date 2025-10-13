import pool from "../db.js";
export const post_temp = async (req, res, io) => {
    try {
        const { temperatura, humedad } = req.body
        const [resultado] = await pool.query("INSERT INTO sensordht22(user_id, temperatura, humedad) VALUES (?,?,?)",
            [req.userId, temperatura, humedad]
        )
        console.log(req.userId);
        console.log("temperatura:", temperatura, "humedad:", humedad);

        io.emit("sensorData", { temperatura, humedad });
        return res.json({ ok: true, temperatura, humedad, userID:req.userId });
    } catch (error) {
        // Responder solo si NO se ha enviado antes
        if (!res.headersSent) {
            return res.status(500).json({ error: "Error interno" });
        }
    }
}