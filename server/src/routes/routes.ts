import express from "express"
import { artistResponse } from "../controllers/arist-response.controller.js"
import { albumResponse } from "../controllers/album-response.controller.js"
import { createUsers } from "../controllers/create-user.controller.js"
import { Request, Response } from "express";
import { addReviews } from "../controllers/add-reviews.controller.js"

export const router = express.Router()


router.get("/search/:query", artistResponse, (req:Request,res:Response)=> res.json("no results"))

router.get('/artist/:query', albumResponse)

router.post("/create-account", createUsers)

router.post("/review", addReviews)