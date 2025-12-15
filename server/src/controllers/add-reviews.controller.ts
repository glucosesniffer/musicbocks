import { Request, Response } from "express";
import pool from "../config/db.js";

export const addReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { rating, album_id, review_text } = req.body;
  const user_id = req.session.userId; // Use session userId for security

  try {
    if (!user_id) {
      res
        .status(401)
        .json({ success: false, message: "Please login to review!" });
      return;
    }

    if (!rating || !album_id) {
      res
        .status(400)
        .json({ success: false, message: "Rating and album_id are required" });
      return;
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO reviews (rating, album_id, user_id, review_text, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, album_id)
      DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
      `,
      [ratingNum, album_id, user_id, review_text || null],
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
