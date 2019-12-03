const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({api: "api is responsive"});
})

server.post("/api/posts", (req, res) => {
    const postData = req.body;
    if (!postData.title || !postData.contents) {
      res
        .status(400)
        .json({error: "Please provide title and contents for the post." });
    } else {
      db
        .insert(postData)
        .then(post => {
          res.status(201).json(post);
        })
        .catch(err => {
          res.json({error: "The post was not added" });
        });
    }
});

server.post("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const postData = req.body;
    db
      .findById(id)
      .then(post => {
        if (!post || !postData.text) {
          res
            .status(400)
            .json({error: "Please provide text for the comment."});
        } else {
          res.json(post);
        }
      })
      .catch(error => {
        res.status(404)
        .json({error: "The post with the specified ID does not exist."});
      });
})

server.get("/api/posts", (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log('The post information could not be retrieved.', error);
        res
        .status(500)
        .json({errorMessage: "The post information could not be retrieved."})
    })
})

server.get("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    db
      .findById(id)
      .then(post => {
        if (!post) {
          res
            .status(404)
            .json({error: "The post with the specified id does not exist."});
        } else {
          res.json(post);
        }
      })
  });

server.get("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    db
      .findById(id)
      .then(post => {
        if (!post) {
          res
            .status(404)
            .json({error: "The post with the specified id does not exist."});
        } else {
          res.json(post);
        }
      })
      .catch(error => {
        res.status(500)
        .json({error: "The comments information could not be retrieved."});
      });
})

server.delete("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    db
    .findById(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({error: "That post ID doesn't exist on this server."});
      } else {
        db
          .remove(id)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(error => {
            res.status(500).json({error: "There was an error deleting the post."});
          });
      }
    });
  });

  server.put("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    const modify = req.body;
    db.findById(id).then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "That post ID doesn't exist on this server."});
      } else if (!modify.title || !modify.contents) {
        res
          .status(400)
          .json({ error: "Please enter a post title and contents."});
      } else {
        db
          .update(id, modify)
          .then(post => {
            res.status(200).json(post);
          })
          .catch(error => {
            res.status(500).json({ message: "The post could not be modified!"});
          });
      }
    });
  });

const port = 5000;
server.listen(port, () => 
    console.log(`api running on port ${port}`)
);