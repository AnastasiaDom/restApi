const _ = require("lodash");
const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = require("../validators/user");
const cardsSchema = require("../validators/cards");
const UserModel = require("../models/user");
const Card = require("../models/cards");
const checkToken = require("../middleware/checkToken");

const returnUserKeys = ["email", "_id", "name"];
const log = console.log;

router.post("/create", async (req, res) => {
  const { error, value } = userSchema.newUser.validate(req.body);
  const user = value;
  if (error) {
    res.status(400).send(error.details[0].message);
    log(chalk.red(error.details[0].message));
  } else {
    try {
      const result = await UserModel.find({ email: user.email });
      if (result.length > 0) {
        res.status(400).send("User already exists");
        log(chalk.red("Email already exists."));
      } else {
        try {
          const savedUser = await saveUser(user);
          res.status(200).send(savedUser);
          log(chalk.blue("User created successfully"));
        } catch (err) {
          res.status(400).send(err);
          log(chalk.red(err.details[0].message));
        }
      }
    } catch (err) {
      res.status(400).send(err);
      log(chalk.red(err.details[0].message));
    }
  }
});

function saveUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      user.password = await bcrypt.hash(user.password, saltRounds);
      const savedUser = await new UserModel(user).save();
      resolve(_.pick(savedUser, returnUserKeys));
    } catch (err) {
      reject(err);
      log(chalk.red(err.details[0].message));
    }
  });
}

router.get("/me", checkToken, me);
async function me(req, res) {
  const userId = req.uid;
  try {
    const user = await UserModel.findOne({ _id: userId });
    res.status(200).send(_.pick(user, returnUserKeys));
  } catch (err) {
    res.status(401).send("User do not exists, try again");
  }
}

router.post("/auth", login);
async function login(req, res) {
  const { error, value } = userSchema.auth.validate(req.body);
  const user = value;
  if (error) {
    res.status(400).send(error);
    log(chalk.red(error));
  } else {
    try {
      const userModel = await UserModel.findOne({ email: user.email });
      if (!userModel) {
        res.status(400).send("Username or password wrong");
        log(chalk.red("Invalid email"));
        return;
      }
      const isAuth = await userModel.checkPassword(user.password);
      if (!isAuth) {
        res.status(400).send("Username or password wrong");
        log(chalk.red("Invalid password"));
        return;
      }
      res.status(200).send(userModel.getToken());
    } catch (err) {
      res.status(400).send(err);
      log(chalk.red(err));
    }
  }
}

const getCards = async (cardsArray) => {
  const cards = await Card.find({ bizNumber: { $in: cardsArray } });
  return cards;
};

router.get("/cards", checkToken, async (req, res) => {
  if (!req.query.numbers) {
    return res.status(400).send("Missing numbers data");
  }
  let data = {};
  data.cards = req.query.numbers.split(",");
  const cards = await getCards(data.cards);
  res.send(cards);
});

router.get("/mee", checkToken, async (req, res) => {
  const user = await UserModel.findById(req.uid).select("password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = userSchema.newUser.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await UserModel.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new UserModel(
    _.pick(req.body, ["name", "email", "password", "biz", "cards"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;
