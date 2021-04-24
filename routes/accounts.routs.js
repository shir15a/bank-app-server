const express = require("express");
const router = express.Router();
const accountControler = require("../controllers/account.contorller");

router
  .get("/", (req, res) => {
    accountControler.geAll(req, res);
  })
  .get("/:id", (req, res) => {
    accountControler.getSpecificAccount(req, res);
  })
  .post("/", (req, res) => {
    accountControler.create(req, res);
  })

module.exports = router;

