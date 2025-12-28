if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/User.js");
const userRouter = require("./routes/user.js");
const MongoStore = require("connect-mongo").default;
const scholarshipRouter = require("./routes/scholarship.js");
const adminRouter = require("./routes/admin.js");
const reviewRouter = require("./routes/reviews.js");
const scholarship = require("./models/scholarship.js");

const app = express();


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

const dbUrl = process.env.MONGO_URL;


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret:  process.env.SECRET,
  }
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});


const sessionConfig = {
  store, // persist sessions in MongoDB
  secret: process.env.SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  name: "sid",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.session.user || null;
  res.locals.currentAdmin = req.session.admin || null;
  next();
});

app.use("/", userRouter);
app.use("/", scholarshipRouter);
app.use("/", adminRouter);
app.use("/", reviewRouter);


main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 5000,
  });
}


app.get("/contact", (req, res) => {
  res.render("general/contact.ejs");
});

app.get("/faq", (req, res) => {
  res.render("general/faq.ejs");
});

app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { statuscode, message });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
