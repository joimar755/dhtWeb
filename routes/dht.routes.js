import { Router } from 'express'
import { post_temp } from '../Controlador/dht.controller.js';
import { io } from '../server.js'
const router = Router();

//router.get("/api/temp",post_temp);
router.get("/temp/:id", (req, res) => res.send("obteniendo una  temperatura"));
router.post("/send_dht", (req, res) => post_temp(req, res, io));
router.delete("/temp/:id", (req, res) => res.send("obteniendo temperatura"));


export default router;
