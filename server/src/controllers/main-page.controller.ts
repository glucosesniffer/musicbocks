import { Request, Response } from "express";
import pool from "../config/db.js";

export const mainPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT ON (artist_id) * FROM albums ORDER BY artist_id, RANDOM() LIMIT 8;"
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(400).json({ success: false, e });
  }
};
