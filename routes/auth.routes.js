import { Router } from 'express'
import { Cerrar_session, Login, Profile, Register } from '../Controlador/auth.controller.js';

const router = Router();

router.post("/login", Login);
router.post("/registro_users", Register);
router.post("/cerrar_session", Cerrar_session);
router.delete("/perfil", Profile);


export default router;
