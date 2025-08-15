// constants/config.js
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,               // set to your Vercel domain in Render
  "https://<YOUR-FRONTEND>.vercel.app", // add explicitly to be safe
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
