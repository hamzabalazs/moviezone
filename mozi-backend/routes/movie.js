const express = require("express");
const router = express.Router();
const Movie = require('../models/movie')

// Getting all
router.get("/movies", async(req, res) => {
  try{
    const movies = await Movie.find()
    res.json(movies)
  }catch(err){
    res.status(500).json({message:err.message})
  }
});
// Getting one
router.get("/movie/:id", getMovie, async(req, res) => {
  // get id from parameters >> req.params.id
  res.send(res.movie);
});
// Creating one
router.post("/movie", async(req, res) => {
  const movie = new Movie({
    title:req.body.title,
    description:req.body.description,
    poster:req.body.poster,
    releaseDate:req.body.releaseDate,
    categoryId:req.body.categoryId,
    rating:0
  })
  try{
    const newMovie = await movie.save()
    res.status(200).json(newMovie)
  }catch(err){
    res.status(400).json({message:err.message})
  }
});
// Updating One
router.patch("/:id", async(req, res) => {});
// Deleting One
router.delete("/movie/:id",getMovie, async(req, res) => {
  try{
    await Movie.deleteOne({_id : req.params.id})
    res.json({message:"Deleted"})
  }catch(err){
    res.status(500).json({message:err.message})
  }
});

async function getMovie(req,res,next){
  let movie
  try{
    movie = await Movie.findById(req.params.id)
    if(movie == null){
      return res.status(404)
    }
  }catch(err){
    return res.status(500)
  }
  res.movie = movie
  next()
}


module.exports = router;
