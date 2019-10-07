var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err){
                console.log(err);
                res.redirect("back");
            } else {
                // check if the user owns a campground
                if (foundCampground.author.id.equals(req.user._id)) {
                   next();
                } else {
                    req.flash("error", "You don't have permissions to perform this action");
                    res.redirect("back");
                }
            }
            
            });
    } else {
        req.flash("error", "You need to be logged in to perform this actcion");
        res.redirect("../../login");
    }

};


middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // check if the user owns a comment
                if (foundComment.author.id.equals(req.user._id)) {
                   next();
                } else {
                    req.flash("error", "You don't have permissions to perform this action");
                    res.redirect("back");
                }
            }
            
            });
    } else {
        req.flash("error", "You need to be logged in to perform this actcion");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to perform this action");
    res.redirect("/login");
};
 
module.exports = middlewareObj;