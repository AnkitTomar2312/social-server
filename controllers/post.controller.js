const PostModel = require("../modles/post.model");
const formidable = require("formidable");
const fs = require("fs");

const createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send({ message: "Image can't be uploaded" });
    }

    let post = new PostModel(fields);
    post.postedBy = req.user;
    if (files.photo) {
      console.log(files.photo[0]);
      post.photo.data = fs.readFileSync(files.photo[0].filepath);
      post.photo.contentType = files.photo.type;
    }
    post
      .save()
      .then((data) => {
        if (!data) {
          return res.send({ message: "Could not upload the image" });
        }

        res.send(data);
      })
      .catch((e) => {
        console.log(e.message);
        res.send({ message: e.message || "Some error occured" });
      });
  });
};

const photo = (req, res) => {
  const id = req.params.postId;
  PostModel.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "post not found" });
      }
      PostPhoto = data.photo;
      res.status(200).send(PostPhoto);
    })
    .catch((e) => {
      res.send({ message: e.message });
    });
};

const listByUser = (req, res) => {
  const id = req.params.userId;
  PostModel.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Nothing to show" });
      }
      res.status(200).send(data);
    })
    .catch((e) => {
      res.send({ message: e.message });
    });
};

module.exports = { createPost, photo, listByUser };
