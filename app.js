require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const multer = require("multer");
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/password");
const vaultRoutes = require("./routes/vault");
const cardRoutes = require("./routes/card");
const fileRoutes = require("./routes/file");

const app = express();

// Multer setup
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "encryptedFiles");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// Database
require("./utils/db-config");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Handling CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(multer({ storage: fileStorage }).single("myfile"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/vault", passwordRoutes);
app.use("/api/vault", cardRoutes);
app.use("/api/vault", fileRoutes);

// Error handler
app.use((error, req, res, next) => {
  console.log(
    chalk.red(
      "\n <-----------------  Custom Error Handler Starts  ------------------> \n"
    )
  );
  console.log(error, "\n");
  console.log(
    chalk.red(
      "<-----------------  Custom Error Handler Finish  ------------------> \n"
    )
  );
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message, data });
});

// listening to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(chalk.blue(`Server listening at ${PORT}`)));
