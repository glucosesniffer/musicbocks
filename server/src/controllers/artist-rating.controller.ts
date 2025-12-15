import { Request, Response } from "express";
import pool from "../config/db.js";

export const addArtistRating = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { artist_id, rating } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
    res
      .status(401)
      .json({ success: false, message: "Please login to rate artists" });
    return;
  }

  if (!rating || !artist_id) {
    res
      .status(400)
      .json({ success: false, message: "Rating and artist_id are required" });
    return;
  }

  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5" });
    return;
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO artist_ratings (rating, artist_id, user_id, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, artist_id)
      DO UPDATE SET rating = EXCLUDED.rating, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
      `,
      [ratingNum, artist_id, user_id],
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getArtistRating = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const user_id = req.session.userId;

  if (!user_id) {
    res.json({ success: true, rating: null });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT rating FROM artist_ratings WHERE artist_id = $1 AND user_id = $2",
      [id, user_id],
    );

    res.json({
      success: true,
      rating: result.rows[0]?.rating || null,
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
