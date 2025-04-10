import "express-async-errors";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
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

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

const port = process.env.PORT || 3000;

// Server Listening and Mongo DB Connection
const start = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://admin:1234@cluster0.mgxihpr.mongodb.net/inquiry-handler-api?retryWrites=true&w=majority&appName=Cluster0",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
        
      )
      .then(() => {
        console.log("Database Connected");
      })
      .catch((error) => {
        console.log(error);
      });
    app.listen(port, () => {
      console.log(`server start on port number ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
