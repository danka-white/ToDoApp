var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var collection;

//connect to db
MongoClient.connect('mongodb://localhost:27017/tododb', function (err, db) {
  if (err) {
    throw err;
  }
  collection = db.collection('tasks');
});

app.use(express.static('public'));
var jsonParser = bodyParser.json();

app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: './public/'});
});
//get lists
app.get('/tasks', function (req, res) {

  collection.find({}).toArray(function (error, tasks) {
      if (error) throw error;
      res.send(tasks);
    });
});
//add task
app.post('/task', jsonParser, function (req, res) {
    collection.insert(req.body, (function (error) {
      if (error) throw error;
      res.json({status: "inserted"});
    }));
});
//replace
app.put('/task/:id', jsonParser, function (req, res) {

    var entity = req.body;
    delete entity._id;
    var id = req.body.id;

    collection.replaceOne({id: id}, entity, function (error, result) {
      if (error) throw error;
      res.json({status: "updated"});
    });
});
//delete task
app.delete('/task/:id', function (req, res) {
    //delete character ":" from req.params.id.substr
    var id = req.params.id.substr(1, req.params.id.length);
    collection.remove({"id": id}, (function (error) {
      if (error) throw error;
      res.json({status: "deleted"});
    }));
});

app.listen(4000, function () {
  console.log('ToDo app listening on port !');
});
