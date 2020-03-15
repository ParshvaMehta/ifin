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

/* [GET] - /bank/all - bank listing. */
router.route("/all").get((req, res) => {
  Bank.find({ status: 1 }, { hash: 0, salt: 0, __v: 0 }, (err, banks) => {
    console.log(err);
    console.log(banks);
    return res.send({ code: 200, banks });
  });
});

/* [PUT] - /bank/add -  New Bank */
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

/* [POST] - /bank/edit -  Edit Bank */
router.route("/edit/:id").post(async (req, res) => {
  const _id = req.params.id;
  const { name, description, type } = req.body;
  if (!name) {
    return res.send({ code: 400, message: "require parameter missing!" });
  }

  Bank.updateOne(
    { _id },
    { name, description, type },
    (err, { n, nModified } = {}) => {
      if (err) {
        console.error(err);
        return res.send({ code: 500, err: "Bank is not added" });
      }
      if (n > 0 || nModified > 0) {
        return res.send({
          code: 200,
          message: "Bank detail updated successfully!"
        });
      }
      return res.send({
        code: 400,
        message: "Bank detail not updated!"
      });
    }
  );
});

module.exports = router;
