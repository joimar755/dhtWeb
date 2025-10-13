import bcrypt from "bcrypt";
import pool from "../db.js";
import { createAccessToken } from "../middleware/auth.js";

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
    const token = await createAccessToken({ id: resultado.insertId }, process.env.JWT_SECRETO, {
      expiresIn: "2h",
    });
    console.log(token);
    return res.json({
      user: rows[0],
      token: token,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      res.json({
        message: "username ya está registrado",
      });
    }
  }
};

export const Login = (req, res) => {};

export const Cerrar_session = (req, res) => {};

export const Profile = (req, res) => {};
