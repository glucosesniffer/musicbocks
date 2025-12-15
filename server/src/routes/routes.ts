import express from "express";
import { artistResponse } from "../controllers/arist-search-response.controller.js";
import { albumResponse } from "../controllers/artist-album-response.controller.js";
import { createUsers } from "../controllers/create-user.controller.js";
import { Request, Response } from "express";
import { addReviews } from "../controllers/add-reviews.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import { albumInfo } from "../controllers/album-info.controller.js";
import { mainPage } from "../controllers/main-page.controller.js";
import {
  getUserReviews,
  updateReview,
} from "../controllers/user-profile.controller.js";
import {
  updateProfilePicture,
  getUserProfile,
} from "../controllers/profile-picture.controller.js";
import {
  addArtistRating,
  getArtistRating,
} from "../controllers/artist-rating.controller.js";

export const router = express.Router();

router.get("/search/:query", artistResponse);

router.get("/artist/:query", albumResponse);

router.get("/album/:id", albumInfo);

router.post("/signup", createUsers);

router.get("/", mainPage);

router.post("/login", loginUser);

router.delete("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.json({ success: false });
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "logged out" });
  });
});

router.post("/review", addReviews);

router.get("/profile/reviews", getUserReviews);

router.put("/review/update", updateReview);

router.get("/profile", getUserProfile);

router.put("/profile/picture", updateProfilePicture);

router.post("/artist/rating", addArtistRating);

router.get("/artist/:id/rating", getArtistRating);
