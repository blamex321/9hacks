const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/hackDB")

const appointmentSchema = new mongoose.Schema({
  name : String,
  registration : String,
  bloodGroup : String,
  mobile:String,
  date:String
});

const Appointment = mongoose.model("appointment",appointmentSchema);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  likes: Number,
  category: String
});

const Post = mongoose.model("post", postSchema);

app.get("/create",function(req,res){
  res.sendFile(__dirname + "/create.html");
});

app.post("/create",function(req,res){
  const postData = new Post({
    title: req.body.title,
    content: req.body.post,
    likes: 0,
    category:req.body.category
  });
  postData.save(function(err){
    if(err){
      console.log(err);
    } else {
      console.log("Post saved successfully");
      res.send("Post saved successfully");
    }
  })
});

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/health",function(req,res){
  res.sendFile(__dirname + "/health.html");
});

app.post("/health",function(req,res){
  const appointmentData = new Appointment({
    name : req.body.name,
    registration:req.body.rNo,
    bloodGroup:req.body.bloodGroup,
    mobile:req.body.mobile,
    date:req.body.date
  });
  appointmentData.save(function(err){
    if(err){
      console.log(err);
    } else {
      console.log("Saved Successfully");
      res.send("Appointment Created");
    }
  })
})

app.get("/list", function(req, res) {
  Post.find({}, function(err, posts) {
    if (err) {
      console.log(err)
    } else {
      res.send(posts);
      // res.render("list", {
      //   posts: posts
      // });
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
   res.render("post", {
     title: post.title,
     content: post.content,
     likes:post.likes,
     category:post.category
   });
 });
});

app.get("/marketplace/auto",function(req,res){
  const autoDetails = {
    Name: "Raviteja",
    mobile: "8179588838"
  }
  res.send(autoDetails);
});

app.post("/posts/:postId/like",function(req,res){
  const requestedPostId = req.params.postId;
  Post.updateOne({_id:requestedPostId},{$inc:{likes:1}}, {new: true },function(err,post){
    if(err){
      console.log(err);
    } else {
      res.send(post);
    }
  });
});

app.listen(3000 || process.env.PORT, function() {
  console.log("server running on port 3000");
})
