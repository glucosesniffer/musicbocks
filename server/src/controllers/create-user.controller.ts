import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";


interface User{
  id: number;
  username: string;
  email: string;
  password: string;
}

export const createUsers = async(req: Request,res: Response): Promise<void> => {
    const {username, email, password} = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userNameRegex = /^[a-z0-9]+$/

    if(!emailRegex.test(email)){
      res.status(400).json({success:false, message:"Please type valid email"})
      return
    }
    if(!userNameRegex.test(username)){
      res.status(400).json({success:false, message: "Please type valid username"})
    }

    if(!email || !username || !password){
      res.status(400).json({success:false, message: "Please fill in all the fields"})
      return
    }
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        await pool.query<User>("INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING *",
            [username, email, hashedPassword]
        )

        res.status(200).json({success:true, data: "User created successufully"})
    } catch (error) {
        res.status(500).json({success:false, error: (error as Error).message})
    }
}