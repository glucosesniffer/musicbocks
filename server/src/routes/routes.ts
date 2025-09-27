import express from "express"
import { artistResponse } from "../controllers/artistResponse.js"
import { createUsers } from "../controllers/createUsers.controller.js"

export const router = express.Router()


router.get("/search/:query", artistResponse)

router.post("/create-account", createUsers)