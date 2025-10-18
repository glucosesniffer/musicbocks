import { Request, Response } from "express";
import pool from "../config/db.js";

export const addReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    rating,
    album_id,
    user_id,
  }: { review: string; rating: number; album_id: number; user_id: number } =
    req.body;
  try {
    if (user_id) {
      console.log(user_id);
      const result = await pool.query(
        `
  INSERT INTO reviews (rating, album_id, user_id)
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, album_id)
  DO UPDATE SET rating = EXCLUDED.rating
  RETURNING *;
  `,
        [rating, album_id, user_id]
      );
      res.status(200).json({ success: true, data: result.rows });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Please login to review!" });
    }
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
