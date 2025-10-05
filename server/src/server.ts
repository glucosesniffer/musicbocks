import express from "express";
import request, { Response} from "request";
import dotenv from "dotenv"
import axios from "axios"
import { router } from "./routes/routes.js";
import session from "express-session";
import { RedisStore } from "connect-redis";

dotenv.config()

const secret = process.env.SPIRAL_SESSION_TICKET || "jellyfish-fishingshark"
const app = express();
import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17931.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17931
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

const redisStore = new RedisStore({
  client,
  prefix: "sess:",
}) as unknown as session.Store;

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result) 


app.use(
  session({
    store: redisStore,  
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

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

app.use("/", router)

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
