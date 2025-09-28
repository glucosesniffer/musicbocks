import express from "express"
import { artistResponse } from "../controllers/artistResponse.js"
import {albumResponse} from "../controllers/albumResponse.controller.js"
import { createUsers } from "../controllers/createUsers.controller.js"
import { Request, Response } from "express";

export const router = express.Router()


router.get("/search/:query", albumResponse, (req:Request,res:Response)=> res.json("no results"))

router.post("/create-account", createUsers)