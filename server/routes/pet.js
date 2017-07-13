var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  database: 'pet_hotel', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time?
  idleTimeoutMillis: 30000 // 30 second time out
};

var pool = new pg.Pool(config);
router.get('/', function(req, res){

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var queryText = 'SELECT "first_name", "last_name", "name", "breed", "color", "pets"."id", ' +
      ' "check_in_date", "check_out_date"  FROM "owners" JOIN "pets" ' +
      'ON "pets"."owner_id" = "owners"."id" JOIN "visits" ON "visits"."id" = "visits"."pet_id";';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          console.log(result.rows);
          res.send(result.rows);
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of GET

router.post('/', function(req, res) {
  var book = req.body;
  console.log(book);

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {

      var queryText = 'INSERT INTO "books" ("author", "title")' +
                      ' VALUES ($1, $2);';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [book.author, book.title], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
});

// PUT is similar to POST when using PG
router.put('/', function(req, res){
  var book = req.body; // Book with updated content
  console.log('Put route called with book of ', book);

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      var queryText = 'UPDATE "books" SET "author" = $1, "title" = $2 WHERE id = $3;';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [book.authorUpdate, book.titleUpdate, book.editingBookId], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
});

// http://localhost:5000/books/5
// ^ Delete book with the id of 5
// DELETE is similar to GET when using PG
router.delete('/:id', function(req, res){
  var id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);

  // YOUR CODE HERE
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      var queryText = 'DELETE FROM "books" WHERE id = $1;';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [id], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
});

module.exports = router;
