import { Request, Response } from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: { username: string; password: string } =
    req.body;

  try {
    const storedPass = await pool.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username]
    );
    if (storedPass.rows.length === 0) {
      res.json({ success: false, data: "username doesnt exist" });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      storedPass.rows[0].password
    );

    if (passwordMatch) {
      req.session.userId = storedPass.rows[0].id;
      req.session.userName = storedPass.rows[0].username;
    } else {
      res.json({ success: false, data: "wrong password" });
    }

    if (req.session.userId) {
      await pool.query("SELECT * FROM users where id=$1", [req.session.userId]);
      res.json({
        success: true,
        data: req.session.userName,
        sessionId: req.sessionID,
      });
    }
    console.log(req.body);
  } catch (e) {
    res.status(400).json({ success: false, message: e });
  }
};
