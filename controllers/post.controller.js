const PostModel = require("../modles/post.model");
const formidable = require("formidable");
const fs = require("fs");
const userModel = require("../modles/user.model");

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
const listByUser = async (req, res) => {
  try {
    const id = req.params.userId;
    let posts = await PostModel.find({ postedBy: id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (e) {
    res.send({ message: e.message });
  }
};

const listNewsFeed = async (req, res) => {
  try {
    const id = req.params.userId;
    //let user = await userModel.findById(id);
    // let following = user.followers;
    // following.push(id);
    let posts = await PostModel.find({
      postedBy: { $in: id },
    })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.send({ message: err.message });
  }
};

const remove = async (req, res) => {
  let post = req.params.postId;
  try {
    let deletedPost = await PostModel.findByIdAndDelete(post);
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};

// const photos = (req, res, next) => {
//   res.set("Content-Type", req.post.photo.contentType);
//   return res.send(req.post.photo.data);
// };

const like = async (req, res) => {
  try {
    let result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};

const unlike = async (req, res) => {
  try {
    let result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};

const comment = async (req, res) => {
  const commentText = req.body.comment; // Renamed to avoid variable name conflict
  const postedBy = req.body.userId;
  const postid = req.body.postId;
  console.log(postedBy, commentText, postid);
  try {
    // Create the comment object
    const newComment = {
      text: commentText, // Assuming 'text' is the field that holds the comment content
      postedBy: postedBy, // Assuming 'postedBy' is the user ID who posted the comment
    };

    // Use $push to add the new comment to the comments array of the post
    let result = await PostModel.findByIdAndUpdate(
      postid,
      { $push: { comments: newComment } }, // Push the new comment object
      { new: true }
    )
      .populate("comments.postedBy", "_id name") // Populate the postedBy field of comments
      .populate("postedBy", "_id name") // Populate the postedBy field of the post
      .exec();

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uncomment = async (req, res) => {
  let comment = req.body.comment;
  try {
    let result = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    res.send({ message: err.message });
  }
};

const isPoster = async (req, res, next) => {
  const id = req.params.postId;
  let ispostedBy = await PostModel.findById(id);
  console.log(id, ispostedBy._id);
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status("403").send({
      error: "User is not authorized",
    });
  }
  next();
};
module.exports = {
  createPost,
  photo,
  listByUser,
  listNewsFeed,
  remove,
  like,
  unlike,
  comment,
  uncomment,
};
