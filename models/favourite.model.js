const mongoose = require("mongoose");

const FavouriteSchema = mongoose.Schema({
  name: String,
  type: String,
  url: String,
});

module.exports = mongoose.model("favourite", FavouriteSchema);
