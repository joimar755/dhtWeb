import { Router } from 'express'
import { DHT_AVG, DHT_AVG_HUMEDAD, post_temp, Reporte_Pdf, Status_Dht } from '../Controlador/dht.controller.js';
import { io } from '../server.js'
import { authenticateToken } from '../middleware/proteccion.js';
const router = Router();

//router.get("/api/temp",post_temp);
router.get("/temp/:id", (req, res) => res.send("obteniendo una  temperatura"));
router.post("/send_dht",authenticateToken, (req, res) => post_temp(req, res, io));
router.delete("/temp/:id", (req, res) => res.send("obteniendo temperatura"));
router.post("/dht/pdf", Reporte_Pdf);
router.get("/estado", Status_Dht);
router.get("/dht/avg",(req,res)=> DHT_AVG(req,res,io));
router.get("/dht/avg/humedad", DHT_AVG_HUMEDAD);





export default router;
