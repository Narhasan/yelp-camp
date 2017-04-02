var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: {type: String, default:"https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
    description: String,
    author: {
          id: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
          },
          username: String
    },
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;