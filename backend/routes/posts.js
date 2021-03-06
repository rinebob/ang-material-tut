const express = require("express");
const multer = require('multer');
const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/bmp': 'bmp',
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("posts.js multer storage.  Invalid mime type");
		if (isValid) {
			error = null;
		}
		cb(error, 'backend/images');
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLowerCase().split(' ').join('-');
		const ext = MIME_TYPE_MAP[file.mimetype];
		const filename = name + '-' + Date.now() + '.' + ext;
		cb(null, filename);
	}
});

// NOTE: these routes are all prepended by '/api/posts' as specified in app.js
// app.use("/api/posts", postsRoutes);  postsRoutes = require routes/posts


router.get("", (req, res, next) => {
	Post.find().then(posts => {
		// console.log('200 posts.js Post.find.  posts = ',posts);
		res.status(200).json({
			message: 'Posts like totally fetched man',
			posts: posts
		});
	});
});

router.get("/:id", (req, res, next) => {
	Post.findById(req.params.id).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({message: 'Post not found!'});
		}
	})
});

router.post("", multer({storage: storage}).single('image'), (req, res, next) => {
	const url = req.protocol + '://' + req.get('host');
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		imagePath: url + '/images/' + req.file.filename
	});
	post.save().then(createdPost => {
		// console.log('000 posts.js r.post post.save.  createdPost = ',createdPost);
		res.status(201).json({
			message: 'Post added sweet dude!',
			post: {
				...createdPost,
				id: createdPost._id
			}

		});
	});
});

router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
	// console.log('posts.js req.file = ', req.file)
	let imagePath = req.body.imagePath;
	if (req.file) {
		const url = req.protocol + '://' + req.get('host');
		imagePath = url + '/images/' + req.file.filename;
	}
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		imagePath: imagePath
	});
	// console.log('posts.js router.put post = ',post);
	Post.updateOne({ _id: req.params.id }, post).then(result => {
		console.log( 'posts.js router.put. result = ', result )
		res.status(200).json({ message: 'posts.js router.put update successful'});
	})
});


router.delete("/:id", (req, res, next) => {
	// console.log("300 posts.js router.delete. req.params.id = ",req.params.id);
	Post.deleteOne({_id: req.params.id}).then(result => {
		// console.log("302 posts.js router.delete.  result = ",result);
	});
	res.status(200).json({message: 'posts.js psych!  Post deleted!'});
});

module.exports = router;
