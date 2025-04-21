import "express-async-errors";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ConfigConnect from "./config/dbConnect.js";

dotenv.config();

const app = express();

// Router
import masterAdminRoute from "./routers/masterAdmin.js";
import collegeRoute from "./routers/college.js";
import landingRoute from "./routers/landing.js";
import counselorRouter from "./routers/counselor.js";
import authRouter from "./routers/authRouter.js";
import facultyRouter from "./routers/faculty.js";

import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import {
  authenticateToken,
  authorizeRole,
} from "./middlewares/authMiddleware.js";

// Middlewares
app.use(express.json());
app.use(morgan("dev"));


const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you're using cookies or sessions
  })
);


// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static folder (e.g., /uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Router
app.get("/", async (req, res) => {
  res.send("Hello Node JS");
});

// Routers Path
app.use(
  "/masterAdmin",
  authenticateToken,
  authorizeRole("Admin"),
  masterAdminRoute
);
app.use("/college", authenticateToken, authorizeRole("College"), collegeRoute);
app.use("/faculty", authenticateToken, authorizeRole("Faculty"), facultyRouter);
app.use(
  "/counselor",
  authenticateToken,
  authorizeRole("Counselor"),
  counselorRouter
);
app.use("/", landingRoute);
app.use("/auth", authRouter);

// Not Found Middleware
app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

// Error Middleware
app.use(errorHandlerMiddleware);

ConfigConnect();

const port = 3000

app.listen(port, () => {
  console.log(`server start on port number ${port}`);
});