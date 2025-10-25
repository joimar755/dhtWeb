import { ledStatus } from "../server.js";
import pool from "../db.js";
import { io } from "../server.js";


export const get_leds = (req, res) => {
    res.json(ledStatus);
}

export const post_leds = async (req, res, io) => {
    try {
        const { led1, led2, led3 } = req.body;
        if (led1 !== undefined) ledStatus.led1 = led1;
        if (led2 !== undefined) ledStatus.led2 = led2;
        if (led3 !== undefined) ledStatus.led3 = led3;
        const [resultado] = await pool.query("INSERT INTO bombillo(led1, led2, led3, user_id) VALUES (?,?,?,?)",
            [led1, led2, led3, req.userId]
        )
        console.log(req.userId);
        io.emit("control", ledStatus);
        console.log("Nuevo estado:", { ledStatus });
        return res.json({ success: true, status: ledStatus, userID: req.userId });
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ error: "Error interno" });
        }
    }
}