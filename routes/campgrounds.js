var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
     if(err){
         console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
       
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});
//SHOW ROUTE
router.get("/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

});
// CREATE CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author ={
        id: req.user.id,
        username: req.user.username
    };
    var newCampground = {name:name, price: price, image:image, description:description, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Congratulations, you have just added a new campground!");
           res.redirect("/campgrounds");
        }
    });
   
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }

    });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, deleted){
       if (err) {
           console.log(req.params.id);
           res.redirect("/campgrounds");
       } else {
           console.log("Deleted campground with name: " +deleted.name);
           console.log(req.params.id);
           res.redirect("/campgrounds");
       }
    });
});


module.exports = router;