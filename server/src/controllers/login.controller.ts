import { Request, Response } from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: { username: string; password: string } =
    req.body;

  try {
    if (!username || !password) {
      res
        .status(400)
        .json({ success: false, data: "Username and password are required" });
      return;
    }

    const storedPass = await pool.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username],
    );

    if (storedPass.rows.length === 0) {
      res.status(401).json({ success: false, data: "Username does not exist" });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      storedPass.rows[0].password,
    );

    if (!passwordMatch) {
      res.status(401).json({ success: false, data: "Wrong password" });
      return;
    }

    req.session.userId = storedPass.rows[0].id;
    req.session.userName = storedPass.rows[0].username;

    res.json({
      success: true,
      data: req.session.userName,
      sessionId: req.sessionID,
      userId: req.session.userId,
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
