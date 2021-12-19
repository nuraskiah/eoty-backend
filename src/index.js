const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { dbConnect } = require("./db");
const { register, count, get } = require("./controllers");

app.use(cors());
app.use(express.json());

app.post("/register", register);
app.get("/count", count);
app.get("/users", get);

const PORT = process.env.PORT;

const startServer = async () => {
  await dbConnect();
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

startServer();
