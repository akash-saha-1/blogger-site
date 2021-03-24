const Post = require("./../database/models/Post");

module.exports = async (req, res) => {
  //res.sendFile(path.resolve(__dirname, "public/pages/index.html"));
  const posts = await Post.find({}).populate("author");
  res.render("index", {
    posts,
  });
};
