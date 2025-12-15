import { Request, Response } from "express";
import pool from "../config/db.js";

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
  const user_id = req.session.userId;
  const { profile_picture } = req.body;

  if (!user_id) {
    res.status(401).json({ success: false, message: "Please login to update profile picture" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING id, username, profile_picture",
      [profile_picture, user_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const user_id = req.session.userId;

  if (!user_id) {
    res.status(401).json({ success: false, message: "Please login" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, username, email, profile_picture, created_at FROM users WHERE id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

