const express = require('express')

const User = require('../models/User')
const Video = require('../models/Video')
const verifyToken = require('../verifyToken')


const router = express.Router();

//update user
router.put("/:id", verifyToken, async (req, res) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).send("Internal Server error")
        }
    } else {
        res.status(403).send("You can update only your account!");
    }
});

//delete user
router.delete("/:id", verifyToken, async (req, res) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted.");
        } catch (error) {
            res.status(500).send("Internal Server error")
        }
    } else {
        res.status(403).send("You can update only your account!");
    }
});

//get a user
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Internal Server error")
    }
});

//subscribe a user
router.put("/sub/:id", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json("Subscription successfull.")
    } catch (error) {
        res.status(500).send("Internal Server error")
    }
});

//unsubscribe a user
router.put("/unsub/:id", verifyToken, async (req, res) => {
    try {
        try {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { subscribedUsers: req.params.id },
            });
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 },
            });
            res.status(200).json("Unsubscription successfull.")
        } catch (err) {
            res.status(500).send("Internal Server error")
        }
    } catch (err) {
        res.status(500).send("Internal Server error")
    }
});

//like a video
router.put("/like/:videoId", verifyToken, async (req, res) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json("The video has been liked.")
    } catch (err) {
        res.status(500).send("Internal Server error")
    }
});

//dislike a video
router.put("/dislike/:videoId", verifyToken, async(req,res)=>{
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
      await Video.findByIdAndUpdate(videoId,{
        $addToSet:{dislikes:id},
        $pull:{likes:id}
      })
      res.status(200).json("The video has been disliked.")
  } catch (err) {
    res.status(500).send("Internal Server error")
  }
});

module.exports = router;