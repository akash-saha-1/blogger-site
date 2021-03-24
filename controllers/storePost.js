const path = require("path");
const Post = require("./../database/models/Post");
const cloudinary = require("cloudinary");
const fs = require("fs");

module.exports = async (req, res) => {
  const { image } = req.files;
  const uploadPath = path.resolve(__dirname, "..", "public/posts", image.name);
  const deleteFile = (filePath) => {
    //fs.unlinkSync(filePath);
  };

  image.mv(uploadPath, (err) => {
    cloudinary.v2.uploader.upload(
      uploadPath,
      {
        folder: "node-blogging-website",
        use_filename: true,
      },
      (err, result) => {
        if (err) {
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
      }
    );
  });
};
