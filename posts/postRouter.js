const express = require('express');
const Posts = require('./postDb');
const router = express.Router();

//Get all the posts == WORKING
router.get('/', (req, res) => {
    Posts.get()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving the posts from the database.'
            })
        })
});
//Get a specific post == WORKING
router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post);
});

//Deleting a post with specific ID == WORKING
router.delete('/:id', validatePostId, (req, res) => {
    Posts.remove(req.params.id)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: `The post was deleted successfully.`
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Database error. The post could not be deleted.'
            })
        })
});


//Update a specific Post == 
router.put('/:id', validatePostId, validatePost, (req, res) => {
    Posts.update(req.params.id, req.body)
        .then(post => {
            console.log(post);
            res.status(200).json({
                message: `Post was successfully updated.`
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Database error. Post was unable to be updated.'
            })
        })
});

// custom middleware

//Validate the ID for a post to make sure it's valid == WORKING
function validatePostId(req, res, next) {
    if (req.params.id) {
        Posts.getById(req.params.id)
            .then(post => {
                if (post.text.length > 0) {
                    //console.log(post);
                    req.post = post;
                    next();
                }
                else {
                    res.status(404).json({
                        message: 'No post with that id.'
                    });
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: "Database error. Could not retrieve post with that id."
                });
            })
    }

    else {
        res.status(400).json({
            message: 'No id parameter set.'
        })
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