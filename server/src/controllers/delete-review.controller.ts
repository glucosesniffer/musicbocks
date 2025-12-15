import { Request, Response } from "express";
import pool from "../config/db.js";

export const deleteReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const review_id = req.params.id;
  const user_id = req.session.userId;

  try {
    if (!user_id) {
      res
        .status(401)
        .json({ success: false, message: "Please login to delete reviews" });
      return;
    }

    const result = await pool.query(
      `DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *`,
      [review_id, user_id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
