import express from "express";
import request, { Response as ReqResponse } from "request";
import pool from "./config/db.js";
import { Request, Response } from "express";
import { createUsers } from "./controllers/createUsers.controller.js";
import dotenv from "dotenv"

dotenv.config()

const app = express();
app.use(express.json());

const PORT = 5000;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error: any, response: ReqResponse, body: { access_token: string }) {
  if (!error && response.statusCode === 200) {
    const token = body.access_token;
    console.log("Spotify token:", token);
  } else {
    console.error("Error fetching token:", error || body);
  }
});


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
function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

