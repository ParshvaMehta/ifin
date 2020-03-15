"use strict";
var express = require("express");
var router = express.Router();
const Bank = require("../model/bank.model");
var constants = require("../constants");

async function getBankByName(name = "") {
  return Bank.findOne(
    { $and: [{ status: 1 }, { name }] },
    async (err, bank) => {
      if (err) {
        return null;
      }
      return bank;
    }
  );
}

/* [GET] - /bank/all - users listing. */
router.route("/all").get((req, res) => {
  Bank.find({ status: 1 }, { hash: 0, salt: 0, __v: 0 }, (err, banks) => {
    console.log(err);
    console.log(banks);
    return res.send({ code: 200, banks });
  });
});

/* [PUT] - /bank/add -  Signup new USER */
router.route("/add").put(async (req, res) => {
  const { name, description, type } = req.body;
  if (!name) {
    return res.send({ code: 400, message: "require parameter missing!" });
  }
  const isExistingBank = await getBankByName(name);
  if (isExistingBank) {
    return res.send({ code: 400, message: "Bank Already Exists" });
  }
  const bank = new Bank({
    name,
    description,
    type
  });
  bank.save((err, bank) => {
    if (err) {
      console.error(err);
      return res.send({ code: 500, err: "Bank is not added" });
    }
    return res.send({ code: 200, bank });
  });
});

module.exports = router;
