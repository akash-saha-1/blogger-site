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
  process.env.MONGO_DB_URI,
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
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
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

const port = process.env.PORT || 400;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
