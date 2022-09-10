const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://anastasiaDom21:anadom21@cluster0.nxxmirr.mongodb.net/restApi",
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => console.log("connecting to mongodb!"))
  .catch((err) => console.error("Could not connect to mongodb", err));

exports.modules = mongoose;
