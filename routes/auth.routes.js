import { Router } from 'express'

const router = Router();

router.post("/login", (req, res) => res.send("login usuarios"));
router.post("/registro_users", (req, res) => res.send("registro usuarios"));
router.post("/cerrar_session", (req, res) => res.send("cerrar_session"));
router.delete("/perfil", (req, res) => res.send("perfil usuario"));


export default router;
