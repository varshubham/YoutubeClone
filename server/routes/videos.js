const express = require('express')
const User = require('../models/User')
const Video = require('../models/Video')

const verifyToken  = require('../verifyToken');

const router = express.Router();

//create a video
router.post("/", verifyToken,async (req,res)=>{
    const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    res.status(500).send("Internal Server error")
  }
})
router.put("/:id", verifyToken, async (req,res)=>{
    const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    res.status(500).send("Internal Server error")
  }
})
router.delete("/:id", verifyToken,async (req,res)=>{
    const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    res.status(500).send("Internal Server error")
  }
})
router.get("/find/:id", async(req,res)=>{
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
      } catch (err) {
        res.status(500).send("Internal Server error")
      }
})
router.put("/view/:id", async(req,res)=>{
    try {
        await Video.findByIdAndUpdate(req.params.id, {
          $inc: { views: 1 },
        });
        res.status(200).json("The view has been increased.");
      } catch (err) {
        res.status(500).send("Internal Server error")
      }
})
router.get("/trend",async(req,res)=>{
    try {
        const videos = await Video.find().sort({ views: -1 });
        res.status(200).json(videos);
      } catch (err) {
        res.status(500).send("Internal Server error")
      }
})
router.get("/random", async(req,res)=>{
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
      } catch (err) {
        res.status(500).send("Internal Server error")
      }
})
router.get("/sub",verifyToken, async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;
    
        const list = await Promise.all(
          subscribedChannels.map(async (channelId) => {
            return await Video.find({ userId: channelId });
          })
        );
    
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
      } catch (err) {
        res.status(500).send("Internal Server error")
      }
})
router.get("/tags", async(req,res)=>{
    const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).send("Internal Server error")
  }
})
router.get("/search", async(req,res)=>{
    const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).send("Internal Server error")
  }
})

module.exports = router;