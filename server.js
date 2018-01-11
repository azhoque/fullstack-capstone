const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { DATABASE_URL, PORT, JWT_SECRET, JWT_EXPIRY} = require("./config");
const { OnTrack, User} = require("./models");
const app = express();

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.Promise = global.Promise;

app.get("/projects", (req, res) => {
  OnTrack.find()
    .then(projects => {
      res.json(projects.map(projects => projects.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.get("/projects/:id", (req, res) => {
  OnTrack.findById(req.params.id)
    .then(projects => res.json(projects.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly wrong" });
    });
});

app.post("/projects", (req, res) => {
  const requiredFields = ["date", "project", "pm", "recentStatus", "share"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }  
  }

  OnTrack.create({
    date: req.body.date,
    project: req.body.project,
    pm: req.body.pm,
    release: req.body.release,
    recentStatus: req.body.recentStatus,
    statusHistory: [{message: req.body.recentStatus, date: new Date()}],
    share: req.body.share
  })
    .then(onTrack => res.status(201).json(onTrack.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.delete("/projects/:id", (req, res) => {
  OnTrack.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.put("/projects/:id", (req, res) => {
  if (!(req.params.id && req.body.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = ["date", "recentStatus", "statusHistory", "team"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  OnTrack.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedprojects => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

app.delete("/:id", (req, res) => {
  OnTrack.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted blog projects with id \`${req.params.ID}\``);
    res.status(204).end();
  });
});
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      else{
        const authToken = createAuthToken(user);
        return res.status(201).json(authToken); 
      }
    })
});  

app.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        email,
        username,
        password: hash,
      });
    })
    .then(user => {
      const authToken = createAuthToken(user);
      return res.status(201).json(authToken);
    })
    .catch(err => {
      console.log(err);
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});
const createAuthToken = function(user) {
  return jwt.sign({user},JWT_SECRET, {
    subject: user.username,
    expiresIn:JWT_EXPIRY,
    algorithm: 'HS256'
  });
};


app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
