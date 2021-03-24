const path = require("path");
const Post = require("./../database/models/Post");
const cloudinary = require("cloudinary");
const fs = require("fs");

module.exports = async (req, res) => {
  const { image } = req.files;
  console.log(image);
  const uploadPath = path.resolve("./../public/posts", image.name);
  //console.log(uploadPath);
  const deleteFile = (filePath) => {
    //fs.unlinkSync(filePath);
  };

  // image.mv(uploadPath, (err) => {
  //   if (err) {
  //     console.log(1);
  //     console.log(err);
  //   }
  // cloudinary.v2.uploader.upload(image.name, (err, result) => {
  //   if (err) {
  //     console.log(2);
  //     console.log(err);
  //     deleteFile(uploadPath);
  //     return res.redirect("/post/new");
  //   }

  //   Post.create(
  //     {
  //       ...req.body,
  //       image: result.secure_url,
  //       author: req.session.userId,
  //     },
  //     (err, post) => {
  //       if (err) {
  //         console.log(3);
  //         console.log(err);
  //       }
  //       deleteFile(uploadPath);
  //       res.redirect("/");
  //     }
  //   );
  // });
  //});
  stream = cloudinary.uploader.upload_stream(
    function (result) {
      console.log(result);
      res.send(
        'Done:<br/> <img src="' +
          result.url +
          '"/><br/>' +
          cloudinary.image(result.public_id, {
            format: "png",
            width: 100,
            height: 130,
            crop: "fill",
          })
      );
    },
    { public_id: req.body.title }
  );
  console.log(req.files.image.path);
  fs.createReadStream(req.files.image.path, { encoding: "binary" })
    .on("data", stream.write)
    .on("end", stream.end);
};
