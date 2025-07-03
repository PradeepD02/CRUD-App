const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// Create Express app
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://mongo-service:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Define Mongoose Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  updatedAt: { type: Date, default: Date.now }
});

// Create Model
const Post = mongoose.model("Post", postSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes

// GET all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

// CREATE post
app.post("/posts", async (req, res) => {
  const { title, content, updatedAt } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const post = new Post({ title, content, updatedAt });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Error creating post" });
  }
});

// UPDATE post
app.put("/posts/:id", async (req, res) => {
  const { title, content, updatedAt } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: title ?? undefined,
        content: content ?? undefined,
        updatedAt: updatedAt || new Date(),
      },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// DELETE post
app.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
