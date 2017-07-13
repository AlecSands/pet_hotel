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


//THIS ROUTE IS IN PROGRESS !!!!!!!!!!!!!
router.post('/', function(req, res) {
  var pet = req.body;
  console.log(pet);

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {

      var queryText = 'INSERT INTO "pets" ("name", "breed", "color", "owner_id")' +
                      ' VALUES ($1, $2, $3, $4);';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [pet.name, pet.breed, pet.color, pet.owner_id], function(errorMakingQuery, result){
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
//THIS ROUTE IS IN PROGRESS !!!!!!!!!!!!!



// PUT is similar to POST when using PG
router.put('/', function(req, res){
  var id = req.params.id;
  var pet = req.body; // Book with updated content
  console.log('Put route called with pet: ', pet);
  console.log('the pet id is: ', id);

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      var queryText = 'UPDATE "pets" SET "name" = $1, "breed" = $2, "color" = $3 WHERE id = $4;';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [book.authorUpdate, book.titleUpdate, book.editingBookId, pet.id], function(errorMakingQuery, result){
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
      var queryText = 'DELETE FROM "pets" WHERE id = $1;';
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
