require("dotenv").config();
const PORT = process.env.PORT;

const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json());


require("./databases/mongoDb");

const morgan = require("morgan");
app.use(morgan("combined"));

const cors = require("cors");
app.use(cors());

const user = require("./routes/user");
const cards = require("./routes/cards");
const checkConnection = require("./middleware/checkConnection");
app.use(checkConnection);

app.use("/user", user);
app.use("/cards", cards);

app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});
