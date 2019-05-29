const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

//adding a user == WORKING
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
    req.body.user_id = req.user.id;
    console.log(req.body.user_id);
    Posts.insert(req.body)
        .then(post => {
            console.log(post);
            res.status(200).json({
                message: 'Post successfully created.'
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Database error. Post was unable to be created.'
            })
        })
});

//get all of the users == WORKING
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

//get a specific user == WORKING
router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

//get posts for a specific user == WORKING
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


//delete a specific user == WORKING
router.delete('/:id', validateUserId, (req, res) => {
    Users.remove(req.params.id)
        .then(user => {
            console.log(user);
            console.log(req.user);
            res.status(200).json({
                message: `${user} User deleted.`
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Database error. User was unable to be deleted.'
            });
    })
});

//update a specific user == WORKING
router.put('/:id', validateUserId, validateUser, (req, res) => {
    Users.update(req.params.id, req.body)
    .then(user => {
        console.log(user);
        res.status(200).json({
            message: `${req.body.name} was successfully updated.`
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'Database error. User was unable to be updated.'
        })
    })

});

//custom middleware

//WORKING ==
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

//WORKING ==
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

//WORKING ==
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
