var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");


var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

var seedDB = require("./seeds");
seedDB();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

mongoose.createConnection("mongodb://localhost/yelp_camp");
    
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret encoding phrase",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

//middleware// used on every route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
});


// ////////
// //ROUTES
// app.get("/", function(req, res) {
//     res.render("home");
// });

// //INDEX
// app.get("/campgrounds", function(req, res) {
//     Campground.find({}, function(err, campgrounds){
//         if (err){
//             console.log(err);
//         }
//         else{
//             res.render("campgrounds/index", {campgrounds:campgrounds});
//         };
//     });
// });

// app.post("/campgrounds", function(req, res) {
//     var name = req.body.name;
//     var image = req.body.image;
//     var new_campground = {name:name, image:image};
    
//     Campground.create(new_campground,
//         function(err, campground){
//             if (err){
//                 console.log(err);
//             }
//             else {
//                 console.log("New Campground Added: " + campground);
//             }
//         }
//     );
    
//     res.redirect("/campgrounds");
// });

// //New campground form
// app.get("/campgrounds/new", function(req, res){
//   res.render("campgrounds/new"); 
// });

// // SHOW - shows more info about one campground
// app.get("/campgrounds/:id", function(req, res){
//     //find the campground with provided ID
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
//         if(err){
//             console.log(err);
//         } else {
//             //render show template with that campground
//             res.render("campgrounds/show", {campground: foundCampground});
//         }
//     });
// })

// //New Comment form
// app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
//   Campground.findById(req.params.id, function (err, campground){
//       if (err){
//           console.log(err);
//       } else {
//             res.render("comments/new", {campground: campground}); 
//       }
//   });

// });

// //Post a new comment
// app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
//     Campground.findById(req.params.id, function (err, campground){
//       if (err){
//           console.log(err);
//       } else {
//              Comment.create(req.body.comment, function(err, comment){
//                 if (err){
//                     console.log(err);
//                 }
//                 else {
//                     campground.comments.push(comment);
//                     campground.save();
//                     res.redirect("/campgrounds/" + campground._id);
//                 }
//             });
//       }
//   });
   
// });

// //New User Form
// app.get("/register", function(req, res){
//   res.render("register"); 
// });

// //Create New User
// app.post("/register", function(req, res){
//     var newUser = new User({username:req.body.username});
//     User.register(newUser, req.body.password, function(err, user){
//         if (err){
//             console.log(err);
//             return res.render("register");
//         }else{
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/campgrounds");
//             })
//         }
//     })
// });

// // show login form
// app.get("/login", function(req, res){
//   res.render("login"); 
// });
// // handling login logic
// app.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     }), function(req, res){
// });

// app.get("/logout", function(req, res){
//   req.logout();
//   res.redirect("/campgrounds");
// });

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server running!");
});
