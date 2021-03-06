const path = require("path");
const Post = require("./../database/models/Post");
const cloudinary = require("cloudinary");
const fs = require("fs");

module.exports = async (req, res) => {
  const { image } = req.files;
  console.log(image);
  const uploadPath = path.resolve("./../public/posts", image.name);
  console.log(uploadPath);
  const deleteFile = (filePath) => {
    //fs.unlinkSync(filePath);
  };

  // image.mv(uploadPath, (err) => {
  //   if (err) {
  //     console.log(1);
  //     console.log(err);
  //   }
  //this image saving in server is not possible in heroku so implemented encrypted data and uploaded it.
  let encodedData = image.data.toString("base64");
  let uploadString = "";
  if (image.mimetype == "image/png") {
    uploadString = `data:image/png;base64,${encodedData}`;
  } else if (image.mimetype == "image/jpg") {
    uploadString = `data:image/jpg;base64,${encodedData}`;
  } else if (image.mimetype == "image/jpeg") {
    uploadString = `data:image/jpeg;base64,${encodedData}`;
  } else {
    return res.redirect("/post/new");
  }

  cloudinary.v2.uploader.upload(
    uploadString,
    {
      folder: "node-blogging-website",
      use_filename: true,
    },
    (err, result) => {
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
            return res.redirect("/post/new");
          }
          deleteFile(uploadPath);
          res.redirect("/");
        }
      );
    }
  );
  //});
};
