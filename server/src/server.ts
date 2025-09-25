import express from "express";
import request, { Response} from "request";
import { createUsers } from "./controllers/createUsers.controller.js";
import dotenv from "dotenv"
import axios from "axios"
import { spotifyResponse } from "./controllers/spotifyResponse.controller.js";

dotenv.config()

const app = express();
app.use(express.json());

const PORT = 5000;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let token: string;

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


request.post(authOptions, function(error: any, response: Response, body: { access_token: string }) {
  if (!error && response.statusCode === 200) {
    token = body.access_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.error("Error fetching token:", error || body);
  }
});

app.get("/search/:query", spotifyResponse)

app.post("/create-account", createUsers)

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
