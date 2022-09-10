const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    biz: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
    cards: Array,
  },

  {
    methods: {
      async checkPassword(password) {
        return await bcrypt.compare(password, this.password);
      },
      getToken() {
        return jwt.sign(
          { id: this._id, biz: this.biz },
          process.env.JWT_PASSWORD
        );
      },
    },
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
