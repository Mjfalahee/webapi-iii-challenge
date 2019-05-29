const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

//adding a user
router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
        .then(user => {
            console.log(user);
            res.status(200).json({
                message: 'User created.'
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error creating the user within the post command.'
            });
        })
    });

//adding a post to a specific user
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    
});

//get all of the users
router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Database error. Unable to retrieve Users.'
            });
        })
});

//get a specific user
router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

//get posts for a specific user
router.get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.user.id)
        .then(posts => {
                res.json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: `Database error. Unable to retrieve user ${req.user}'s posts.`
            });
        })
});


//delete a specific user
router.delete('/:id', (req, res) => {

});

//update a specific user
router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    if (req.params.id) {
        Users.getById(req.params.id)
            .then(user => {
                if (user.name.length > 0) {
                    console.log(user);
                    req.user = user;
                    next();
                }})
            .catch(error => {
                res.status(400).json({
                    message: 'Invalid user ID.'
                });
            })
    }
    else {
        res.status(400).json({
            message: 'No id parameter set.'
        });
    } 
};

function validateUser(req, res, next) {
    if (req.body) {
        if (req.body.name) {
            next();
        }
        else {
            res.status(400).json({
                message: 'Missing required name field.'
            });
        }
    }
    else {
        res.status(400).json({message: 'Missing user data.'});
    }
};

function validatePost(req, res, next) {
    if (req.body) {
        if (req.body.text) {
            next();
        }
        else {
            res.status(400).json({
                message: 'Missing required text field in req.body'
            });
        }
     }
    else {
        res.status(400).json({
            message: 'Missing post data in req.body'
        });
     }

};

module.exports = router;
