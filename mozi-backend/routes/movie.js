const express = require('express')
const router = express.Router()

// Getting all
router.get('/ ',(req,res) => {
    // send data back ( postman works ) >> res.send("hello")
    res.send("hello")
})
// Getting one
router.get('/:id', (req,res) => {
    // get id from parameters >> req.params.id
    res.send(req.params.id)
    
    
})
// Creating one
router.post('/',(req,res) => {

})
// Updating One
router.patch('/:id',(req,res) => {

})
// Deleting One
router.delete('/:id',(req,res) => {

})
module.exports = router