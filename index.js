require("dotenv").config();
const express = require("express");
const { engine } = require("express-edge");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
const cloudinary = require("cloudinary");

const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const createUserController = require("./controllers/createUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");
const validateCreatePostMiddleware = require("./middleware/storePost");
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

const app = express();

mongoose.connect(
  "mongodb+srv://akash:12345@blogging-site.towh1.mongodb.net/node-blog?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) return console.log(err);
    //console.log("db connected");
  }
);

app.use(connectFlash());

app.use(
  expressSession({
    secret: "super_secret",
    resave: true,
    saveUninitialized: true,
  })
);

cloudinary.config({
  api_key: "629323566933331",
  api_secret: "J_vytVzj4Uum6VPVjjJ_gvBnOEY",
  cloud_name: "akash-cloudinary",
});

app.use(express.static("public"));

app.use(engine);
app.set("views", `${__dirname}/views`);
app.use("*", (req, res, next) => {
  // * means it will be applied for all request
  //edge.global("auth", req.session.userId);
  res.locals = {
    auth: req.session.userId,
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

app.get("/", homePageController);

app.get("/register", redirectIfAuthenticated, createUserController);

app.get("/login", redirectIfAuthenticated, loginController);

app.get("/logout", auth, logoutController);

app.get("/post/new", auth, createPostController);

app.get("/post/:id", getPostController);

app.post(
  "/post/store",
  auth,
  validateCreatePostMiddleware,
  storePostController
);

app.post("/users/register", redirectIfAuthenticated, storeUserController);

app.post("/users/login", redirectIfAuthenticated, loginUserController);

app.use((req, res) => {
  res.render("error");
});

const port = process.env.PORT || 4000;
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`App listening on port ${port}`);
});
