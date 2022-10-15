const express= require('express')

const verifyToken = require("../verifyToken.js") 
const router = express.Router();
const createError = require('../error')
const Comment = require('../models/Comment')
const Video = require('../models/Video')

router.post("/", verifyToken,async (req,res)=>{
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    try {
      const savedComment = await newComment.save();
      res.status(200).send(savedComment);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
})
router.delete("/:id", verifyToken, async(req,res)=>{
    try {
        const comment = await Comment.findById(res.params.id);
        const video = await Video.findById(res.params.id);
        if (req.user.id === comment.userId || req.user.id === video.userId) {
          await Comment.findByIdAndDelete(req.params.id);
          res.status(200).json("The comment has been deleted.");
        } else {
          return next(createError(403, "You can delete ony your comment!"));
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
      }
})
router.get("/:videoId", async(req,res)=>{
    try {
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(200).json(comments);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
      }
})

module.exports= router;