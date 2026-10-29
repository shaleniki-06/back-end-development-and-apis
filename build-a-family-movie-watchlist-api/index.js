import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
