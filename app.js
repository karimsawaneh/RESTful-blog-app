var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

    // setup mongoose
mongoose.connect('mongodb://localhost/restful_blog_app', {
    useMongoClient: true,
});
mongoose.Promise = global.Promise;

// app config/ set view engine and static path and bodyparser
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// RESTful Routes
// this redirects to the homepage anytime we load the url
app.get('/', function(req, res){
    res.redirect('/blogs');
});
// Home
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('ERROR');
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});




// set app to listen for requests
app.listen(process.env.port || 3000, function () {
    console.log('Server started on port 3000...');
});

