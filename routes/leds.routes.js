import { Router } from 'express'
import { io } from '../server.js'
import { get_leds, post_leds } from '../Controlador/led.controller.js';
import { authenticateToken } from '../middleware/proteccion.js';

const router = Router();

router.get("/leds",authenticateToken, get_leds);
router.get("/leds/:id", (req, res) => res.send("obteniendo un leds"));
router.post("/leds",authenticateToken,  (req, res) => post_leds(req, res, io));
//router.delete("/temp/:id", (req, res) => res.send("obteniendo temperatura"));


export default router;
