import express from "express";
import pool from "./config/db.js";
import { Request, Response } from "express";
import { createUsers } from "./controllers/createUsers.controller.js";


const app = express();
app.use(express.json());

const PORT = 5000

interface User{
  id: number;
  username: string;
  email: string;
  password: string;
}

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<User>("SELECT * FROM users;");
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({success:false, error: (error as Error).message})
  }
});

app.post("/create-account", createUsers)

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
