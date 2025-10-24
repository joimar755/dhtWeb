import pool from "../db.js";
import { io } from "../server.js";
export const post_temp = async (req, res, io) => {
  try {
    const { temperatura, humedad } = req.body;
    const [resultado] = await pool.query(
      "INSERT INTO sensordht22(user_id, temperatura, humedad) VALUES (?,?,?)",
      [req.userId, temperatura, humedad]
    );
    console.log(req.userId);
    console.log("temperatura:", temperatura, "humedad:", humedad);

    io.emit("sensorData", { temperatura, humedad });
    return res.json({ ok: true, temperatura, humedad, userID: req.userId });
  } catch (error) {
    // Responder solo si NO se ha enviado antes
    if (!res.headersSent) {
      return res.status(500).json({ error: "Error interno" });
    }
  }
};
export const Reporte_Pdf = async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "SELECT s.temperatura as TEMPERATURA, s.humedad as HUMEDAD, l.username AS NOMBRE_USUARIO, s.fecha AS FECHA FROM sensordht22 s INNER JOIN login l ON l.id = s.user_id"
    );
    return res.json({
      data: resultado,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

export const Status_Dht = async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "SELECT s.temperatura as TEMPERATURA, s.humedad as HUMEDAD, s.fecha AS FECHA FROM sensordht22 s ORDER BY s.id DESC LIMIT 1"
    );

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "No hay datos disponibles" });
    }

    // Enviamos el último registro
    return res.json({
      data: resultado[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};
export const DHT_AVG = async (req, res, io) => {
  try {
    const [resultado] = await pool.query(
      `SELECT 
         AVG(s.temperatura) AS PROMEDIO_TEMPERATURA, 
         AVG(s.humedad) AS PROMEDIO_HUMEDAD, 
         s.fecha
       FROM sensordht22 s`
    );

    const data = {
      temperatura: resultado[0].PROMEDIO_TEMPERATURA,
      humedad: resultado[0].PROMEDIO_HUMEDAD
    };

    // Emitimos por socket.io
    io.emit("dhtAvg", data);

    // Respondemos al cliente HTTP
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

/* export const DHT_AVG_HUMEDAD = async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "select AVG(s.humedad) AS PROMEDIO_HUMEDAD , s.fecha from sensordht22 s"
    );

    const data = {
      humedad: resultado[0].PROMEDIO_HUMEDAD
    };

    // Emitimos por socket.io
    io.emit("HumAVG", data);

    // Respondemos al cliente HTTP
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
}; */
