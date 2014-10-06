/*

    Project : blog
    Tutorial : http://howtonode.org/express-mongodb

 */

// Dependencies
var express = require('express');
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;


var app = module.exports = express.createServer();

// configure app
app.configure(function(){
    app.set('views', __dirname + '/views'); // location of web app views
    app.set('view engine', 'jade'); // view engine
    app.use(express.bodyParser()); // wrapper that tries to decode JSON, if fails tries to decode URLEncoded, if fails tries to decode mutli-part
    app.use(express.methodOverride()); // simulate DELETE and PUT
    app.use(require('stylus').middleware({ src: __dirname + '/public'})); // defines the public directory for stylus engine
    app.use(app.router); // used to route requests
    app.use(express.static(__dirname + '/public')); // sets the static file directory location
});

// show errors and stack traces if run in development mode
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack : true }));
});

// show errors if run in production mode
app.configure('production', function(){
    app.use(express.errorHandler());
});

// run mongodb on localhost:27017
var articleProvider = new ArticleProvider('localhost', 27017);

// -- Routes

// GET '/' send all the articles
app.get('/', function(req, res){
    articleProvider.findAll(function(error, docs){
        res.render('index.jade', {
            title: 'Blog',
            articles: docs
        });
    });
});

// GET '/blog/new'
app.get('/blog/new', function(req,res){
    res.render('blog_new.jade', { title: 'New Post' });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body : req.param('body')
    }, function(error, docs){
        res.redirect('/');
    });
});

// GET '/blog/:id'
app.get('/blog/:id', function(req, res){

    // data set in the req manually, get by : req.param.<name>

    // gets id from request paramters and loads article with given id
    articleProvider.findById(req.param.id, function(error, articles){
       res.render('blog_show.jade', { title: article.title, article:article});
    });
});

// POST '/blog/addComment'
app.post('/blog/addComment', function(req, res){

    // to get post form data do : req.param('<name>')

    // sends person, comment and id from post request to database
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
    }, function(){
        // when complete redirect to blog post with same id
        res.redirect('/blog/' + req.param('_id'))
    });
});

app.listen(3001);