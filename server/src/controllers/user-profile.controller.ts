import { Request, Response } from "express";
import pool from "../config/db.js";

export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  const user_id = req.session.userId;
  
  if (!user_id) {
    res.status(401).json({ success: false, message: "Please login to view your profile" });
    return;
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        r.id as review_id,
        r.rating,
        r.review_text,
        r.created_at,
        r.updated_at,
        a.id as album_id,
        a.title,
        a.year,
        a.image,
        ar.name as artist_name,
        ar.id as artist_id
      FROM reviews r
      JOIN albums a ON r.album_id = a.id
      JOIN artists ar ON a.artist_id = ar.id
      WHERE r.user_id = $1
      ORDER BY r.updated_at DESC
      `,
      [user_id]
    );

    res.json({ success: true, data: result.rows });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  const user_id = req.session.userId;
  const { review_id, rating, review_text } = req.body;

  if (!user_id) {
    res.status(401).json({ success: false, message: "Please login to update reviews" });
    return;
  }

  try {
    // Verify the review belongs to the user
    const checkReview = await pool.query(
      "SELECT * FROM reviews WHERE id = $1 AND user_id = $2",
      [review_id, user_id]
    );

    if (checkReview.rows.length === 0) {
      res.status(403).json({ success: false, message: "Review not found or unauthorized" });
      return;
    }

    const ratingNum = rating ? Number(rating) : null;
    if (ratingNum && (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)) {
      res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
      return;
    }

    const result = await pool.query(
      `
      UPDATE reviews 
      SET 
        rating = COALESCE($1, rating),
        review_text = COALESCE($2, review_text),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING *
      `,
      [ratingNum, review_text || null, review_id, user_id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

