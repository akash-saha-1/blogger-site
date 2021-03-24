const path = require("path");
const Post = require("./../database/models/Post");
const cloudinary = require("cloudinary");
const fs = require("fs");

module.exports = async (req, res) => {
  const { image } = req.files;
  const uploadPath = path.resolve("./../public/posts", image.name);
  const deleteFile = (filePath) => {
    fs.unlinkSync(filePath);
  };

  image.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
    }
    cloudinary.v2.uploader.upload(uploadPath, (err, result) => {
      if (err) {
        console.log(err);
        deleteFile(uploadPath);
        return res.redirect("/post/new");
      }

      Post.create(
        {
          ...req.body,
          image: result.secure_url,
          author: req.session.userId,
        },
        (err, post) => {
          if (err) {
            console.log(err);
          }
          deleteFile(uploadPath);
          res.redirect("/");
        }
      );
    });
  });
};
