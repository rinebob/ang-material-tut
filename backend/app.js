const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const Post = require('./models/post');


dbURI = 'mongodb://localhost/ang-material-tut';
mongoose.connect( dbURI )
	.then(() => {
		console.log("100 app.js Connected to database");
	})
	.catch((() => {
		console.log("101 app.js mongo connection failed")
	}));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, UPDATE, DELETE, OPTIONS"
	);
	next();
});

app.post("/api/posts", (req, res, next) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	});
	post.save();

	console.log("000 app.js app.post.  post = ", post);
	res.status(201).json({
		message: 'Post added sweet dude!'
	});
});

app.get("/api/posts", (req, res, next) => {
	Post.find().then(posts => {
		console.log('app.js 200 Post.find.  posts = ',posts);
		res.status(200).json({
			message: 'Posts like totally fetched man',
			posts: posts
		});
	});

});

module.exports = app;
