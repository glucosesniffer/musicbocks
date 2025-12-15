import express from "express";
import request, { Response } from "request";
import dotenv from "dotenv";
import axios from "axios";
import { router } from "./routes/routes.js";
import session, { MemoryStore } from "express-session";
import { RedisStore } from "connect-redis";
import cors from "cors";
import { createClient } from "redis";

dotenv.config();
const secret = process.env.SPIRAL_SESSION_TICKET || "jellyfish-fishingshark";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Try to connect to Redis, fall back to memory store if it fails
let sessionStore: session.Store;

// Only try Redis if REDIS_PASSWORD is set (optional feature)
if (process.env.REDIS_PASSWORD) {
  const redisHost =
    process.env.REDIS_HOST ||
    "redis-10487.c274.us-east-1-3.ec2.redns.redis-cloud.com";
  const redisPort = Number(process.env.REDIS_PORT) || 10487;

  const client = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: redisHost,
      port: redisPort,
      connectTimeout: 3000, // 3 second timeout
    },
  });

  let redisConnected = false;

  client.on("error", (err) => {
    // Only log once to avoid spam
    if (!redisConnected) {
      console.log("Redis Client Error:", err.message);
    }
  });

  // Try to connect with timeout
  try {
    await Promise.race([
      client.connect().then(() => {
        redisConnected = true;
        console.log("Connected to Redis for session storage");
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Redis connection timeout after 3s")),
          3000,
        ),
      ),
    ]);

    if (redisConnected) {
      const redisStore = new RedisStore({
        client,
        prefix: "sess:",
      }) as unknown as session.Store;
      sessionStore = redisStore;
    } else {
      throw new Error("Redis not connected");
    }
  } catch (error: any) {
    console.warn("Redis connection failed, using memory store for sessions");
    console.warn("Sessions will be lost on server restart");
    // Use default memory store
    sessionStore = new MemoryStore();
    // Try to disconnect the failed client (don't await, just fire and forget)
    client.quit().catch(() => {});
  }
} else {
  console.log("Redis not configured, using memory store for sessions");
  sessionStore = new MemoryStore();
}

app.use(
  session({
    store: sessionStore,
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

const PORT = 5000;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!client_id || !client_secret) {
  console.error(
    "WARNING: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not found in .env file!",
  );
  console.error("Please add your Spotify API credentials to server/.env");
}

let token: string;

const getSpotifyToken = async (): Promise<void> => {
  if (!client_id || !client_secret) {
    console.error("Cannot fetch Spotify token: Missing credentials");
    return;
  }

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  return new Promise((resolve) => {
    request.post(
      authOptions,
      function (
        error: any,
        response: Response,
        body: { access_token?: string; error?: string },
      ) {
        if (!error && response.statusCode === 200 && body.access_token) {
          token = body.access_token;
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("Spotify API token obtained successfully");
          resolve();
        } else {
          console.error(
            "Error fetching Spotify token:",
            error || body.error || body,
          );
          if (response?.statusCode === 401) {
            console.error(
              "Invalid Spotify credentials. Check your CLIENT_ID and CLIENT_SECRET",
            );
          }
          resolve();
        }
      },
    );
  });
};

// Get token on startup
await getSpotifyToken();

// Refresh token every 50 minutes (tokens expire after 1 hour)
setInterval(
  () => {
    console.log("Refreshing Spotify token...");
    getSpotifyToken();
  },
  50 * 60 * 1000,
);

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
