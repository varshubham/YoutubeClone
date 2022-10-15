const User = require('../models/User')
const bcrypt = require('bcryptjs')
const express = require('express')

const createError = require('../error')
const jwt = require('jsonwebtoken')

const router = express.Router();
const JWT = "secretkey"

//CREATE A USER
router.post("/signup", async (req,res)=>{
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
    
        await newUser.save();
        res.status(200).send("User has been created!");
        const token = jwt.sign({ id: newUser._id }, );
        const { password, ...others } = newUser._doc;
    
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(others);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
      }
})

//SIGN IN
router.post("/signin",async (req,res)=>{
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not found!"));
    
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
    
        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
    
        const token = jwt.sign({ id: user._id }, );
        const { password, ...others } = user._doc;
    
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(others);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
      }
})

//GOOGLE AUTH
router.post("/google", async (req,res)=>{
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const token = jwt.sign({ id: user._id },JWT);
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json(user._doc);
        } else {
          const newUser = new User({
            ...req.body,
            fromGoogle: true,
          });
          const savedUser = await newUser.save();
          const token = jwt.sign({ id: savedUser._id }, JWT);
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json(savedUser._doc);
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
      }
})

module.exports = router