import { Router } from 'express'
import { get_leds, post_leds } from '../Controlador/led.controller.js';
import { authenticateToken } from '../middleware/proteccion.js';

const router = Router();

router.get("/leds",authenticateToken, get_leds);
router.get("/leds/:id", (req, res) => res.send("obteniendo un leds"));
router.post("/leds",authenticateToken, post_leds);
//router.delete("/temp/:id", (req, res) => res.send("obteniendo temperatura"));


export default router;
