// constants/config.js

// Cookie ka naam constant me rakho taaki har jagah same rahe
const CHATTU_TOKEN = "chattu-token";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL, // Render me set karo: https://chatapp-wassup-frontend.vercel.app
  "https://chatapp-wassup-frontend.vercel.app", // hardcode bhi safe option
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow health checks, server-to-server
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export { corsOptions, CHATTU_TOKEN };
