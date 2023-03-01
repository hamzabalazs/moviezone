const express = require("express");
const router = express.Router();

// Getting all
router.get("/users ", (req, res) => {
  // send data back ( postman works ) >> res.send("hello")
  res.send("hello");
});
// Getting one
router.get("/user/:id", (req, res) => {
  // get id from parameters >> req.params.id
  res.send(req.params.id);
});
// Creating one
router.post("/user", (req, res) => {});
// Login
router.post("./login",(req,res) => {
  res.send(console.log("login"))
})
// Updating One
router.patch("/user/:id", (req, res) => {});
// Deleting One
router.delete("/user/:id", (req, res) => {});
module.exports = router;
