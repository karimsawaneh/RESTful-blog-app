var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');
    app = express();

    // setup mongoose
mongoose.connect('mongodb://localhost/restful_blog_app', {
    useMongoClient: true,
});

// app config/ set view engine and static path and bodyparser
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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

// New Post Route
app.get('/blogs/new', function(req, res){
    res.render('new');
});

// Create Post route
app.post('/blogs', function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body); //sanitizes the input
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
            //if successful send to index
        } else {
            res.redirect('/blogs');
        }
    });
});

// show route
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

// EDIT Route
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

// UPDATE Route
app.put('/blogs/:id', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); //sanitizes the input
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DELETE Route
app.delete('/blogs/:id', function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect('/blogs');
        } else {
            //redirect somewhere
            res.redirect('/blogs');
        }
    });
});

// set app to listen for requests
app.listen(process.env.port || 4000, function () {
    console.log('Server started on port 4000...');
});

