import { Request, Response } from "express";
import pool from "../config/db.js";

export const albumInfo = async (req: Request, res: Response): Promise<void> => {
  const album_id = req.params.id;
  const user_id = req.session.userId;
  console.log("User ID from session:", user_id);

  try {
    // Get album info
    const albumResult = await pool.query(
      `SELECT * FROM albums WHERE id=$1 LIMIT 1`,
      [album_id],
    );

    if (albumResult.rows.length === 0) {
      res.status(404).json({ success: false, message: "Album not found" });
      return;
    }

    const album = albumResult.rows[0];

    // Get user's review if logged in
    let userRating = null;
    let userReviewText = null;

    if (user_id) {
      const reviewResult = await pool.query(
        `SELECT rating, review_text FROM reviews WHERE user_id=$1 AND album_id=$2`,
        [user_id, album_id],
      );

      if (reviewResult.rows.length > 0) {
        userRating = reviewResult.rows[0].rating;
        userReviewText = reviewResult.rows[0].review_text;
      }
    }

    // Get all public reviews for this album
    const allReviewsResult = await pool.query(
      `SELECT r.id, r.rating, r.review_text, r.created_at, r.updated_at, u.username, r.user_id
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.album_id = $1
       ORDER BY r.created_at DESC`,
      [album_id],
    );

    res.json({
      ...album,
      rating: userRating,
      review_text: userReviewText,
      reviews: allReviewsResult.rows,
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
