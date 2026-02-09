import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/database.ts";
import authRoute from "./routes/authRoute.ts";
import { specs, swaggerUi } from "./config/swagger.ts";
import userRoute from "./routes/userRoutes.ts";
import blogRoute from "./routes/blogRoutes.ts";
import adminRouter from "./routes/adminRoute.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Insighta application!");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);
app.use("/api/admin", adminRouter);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Database connection and server start
const server = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Client server running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

server();
