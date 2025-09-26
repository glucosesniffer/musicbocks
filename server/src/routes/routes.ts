import express from "express"
import { spotifyResponse } from "../controllers/spotifyResponse.controller.js"
import { createUsers } from "../controllers/createUsers.controller.js"

export const router = express.Router()


router.get("/search/:query", spotifyResponse)

router.post("/create-account", createUsers)