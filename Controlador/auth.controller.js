import bcrypt from "bcrypt";
import pool from "../db.js";
import jwt from "jsonwebtoken"

export const Register = async (req, res) => {
    const { username, password } = req.body;
    //console.log(username,password);

    try {
        const haspassword = await bcrypt.hash(password, 10);
        console.log(haspassword);
        const [resultado] = await pool.query(
            "INSERT INTO login(username,password) VALUES (?,?)",
            [username, haspassword]
        );

        const [rows] = await pool.query(
            "SELECT id, username, fecha FROM login WHERE id = ?",
            [resultado.insertId]
        );
        /*
        const token = await createAccessToken({ id: resultado.insertId }, process.env.JWT_SECRETO, {
          expiresIn: "2h",
        });
        */
        //console.log(token);
        return res.json({
            user: rows[0],
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            res.json({
                message: "username ya está registrado",
            });
        }
    }
};

export const Login = async (req, res) => {
    const { username, password } = req.body;
    const [resultado] = await pool.query("SELECT * FROM login WHERE username = ?", [username]);
    
    if (resultado.length === 0) {
        return res.status(400).json({
            message: "username no está registrado",
        })
    };
    const validate = await bcrypt.compare(password, resultado[0].password);
    if (!validate) {
        return res.status(400).json({ message: "El users y password invalido" });
    }

    if (!resultado) {
        return res.status(400).json({ message: "El users y password invalido" });
    }
    const token = jwt.sign({ id: resultado[0].id, username: resultado[0].username }, process.env.JWT_SECRETO, { expiresIn: '2h' });
    
    return res.json({
        token: token,
    });

};

export const Cerrar_session = (req, res) => { };

export const Profile = (req, res) => { };
