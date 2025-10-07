import express from "express"
import { artistResponse } from "../controllers/arist-search-response.controller.js"
import { albumResponse } from "../controllers/artist-album-response.controller.js"
import { createUsers } from "../controllers/create-user.controller.js"
import { Request, Response } from "express";
import { addReviews } from "../controllers/add-reviews.controller.js"
import { loginUser } from "../controllers/login.controller.js";
import { albumInfo } from "../controllers/album-info.controller.js";
import { mainPage } from "../controllers/main-page.controller.js";

export const router = express.Router()


router.get("/search/:query", artistResponse, (req:Request,res:Response)=> res.json("no results"))

router.get('/artist/:query', albumResponse)

router.get('/album/:query', albumInfo)

router.post("/signup", createUsers)

router.post('/login', loginUser)

router.get('/', mainPage)

router.delete('/logout', (req: Request, res: Response)=>{
    req.session.destroy((err)=>{
        if(err) return res.json({success:false})
        res.clearCookie("connect.sid");
        res.json({success:true, message: "logged out"})
    })
})

router.post("/review", addReviews)