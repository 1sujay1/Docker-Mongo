const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const axios = require("axios").default;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Favourite = require("./models/favourite.model");

app.get("/favourites", async (req, res) => {
  const allFav = await Favourite.find();
  res.status(200).json({
    status: true,
    data: allFav,
  });
});

app.post("/favourites", async (req, res) => {
  try {
    const { name, type, url } = req.body;
    if (type !== "MOVIE" && type !== "CHARACTER")
      throw new Error("'type' should be 'MOVIE' or 'CHARACTER'");

    const checkExists = await Favourite.findOne({ name });

    if (checkExists) throw new Error("Favourite already exists");

    const resp = await Favourite.create({ name, type, url });
    res.status(200).json({
      status: true,
      data: resp,
      message: "Favourite created successfully...",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error,
      message: error.message,
    });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const { data } = await axios.get("https://swapi.dev/api/films");
    res.json({ status: true, data });
  } catch (error) {
    throw new Error(error.message);
  }
});
app.get("/people", async (req, res) => {
  try {
    const { data } = await axios.get("https://swapi.dev/api/people");
    res.json({ status: true, data });
  } catch (error) {
    throw new Error(error.message);
  }
});
mongoose
  .connect(process.env.DD_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MONGODB ...", process.env.DD_URL);
    app.listen(process.env.PORT, () => {
      console.log("Listening to port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error Connecting to Mongodb instance", err);
    process.exit();
  });
