require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./helper/connect");
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/CarRoutes");

const app = express();

connectDB();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occurred" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
