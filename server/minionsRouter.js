// import section
const express = require('express');
// import the database
const { 
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require('./db.js');

/* --------------------------------------------------- */

// create the router
const minionRouter = express.Router();


/* ---------------- helper functions ---------------------------- */
// validate data from any entering minion
const validateData = (obj) => {
  if(
    typeof obj.name !== "string" ||
    typeof obj.title !== "string" ||
    isNaN(parseInt(obj.salary))
  ) {
    return false;
  } else {
    return true;
  }
}


// validate data from any entering work for minions
const validateWorkData = obj => {

  // check for the containing data from obj
  if(
    typeof obj.title !== "string" ||
    typeof obj.description !== "string" ||
    isNaN(Number(obj.hours)) ||
    typeof obj.minionId !== "string"
  ) {
    return false;
  } else {
    return true;
  }

}

/* ----------------- additional middlewares ---------------------- */

minionRouter.param('minionId', (req, res, next, id) => {

  // check if the id is valid
  const validMinion = getFromDatabaseById("minions", id);

  if(validMinion) {
    // attach the minion to the req
    req.minion = validMinion;
    // attach the id to the req
    req.id = id;
    // pass to the next middleware
    next();
  } else {
    res.status(404).send("Not Found");
  }

})

minionRouter.param('workId', (req, res, next, id) => {

  // check if the id is valid
  const validWorkId = getFromDatabaseById("work", id);

  if(validWorkId) {
    //attach the work to the req
    req.work = validWorkId;
    // attach the work id to the req
    req.WorkId = id;

    next();
  } else {
    res.status(404).send("Not Found");
  }

})


/* ----------------------- manage the requests for minions ------------------- */

/*
Minion structure
- Minion:
  - id: string
  - name: string
  - title: string
  - salary: number
*/

// GET the entire array of minions
minionRouter.get('', (req, res, next) => {
  res.status(200).send(getAllFromDatabase('minions'));
})


// POST create a new minion and save in db
minionRouter.post('', (req, res, next) => {
    const data = req.body;
    // check if the data is valid and save the response to isValid const
    const isValid = validateData(data);

    // check if the response is true
    if(isValid) {
      // call addToDataBase passing the obj
      const objectCreated = addToDatabase("minions", data);
      // response with code 200
      res.status(201).send(objectCreated);
    } else {
      // response with 400 bas request
      res.status(400).send('Invalid Data');
    }
})

// GET a single minion by ID
minionRouter.get("/:minionId", (req, res, next) => {
  // respond with the actual minion
  res.send(req.minion);
});


// PUT update minion by ID
minionRouter.put("/:minionId", (req, res, next) => {
  // update the minion
  const minionUpdated = updateInstanceInDatabase("minions", req.body);
  // response with the updated version
  res.status(200).send(minionUpdated);
});

// DELETE by id any minion valid
minionRouter.delete("/:minionId", (req, res, next) => {
  // use the delete function
  deleteFromDatabasebyId("minions", req.id);
  // send the response
  res.status(204).send("Successfully deleted");
})


/*--------------------- manage work for minions --------------------*/
// GET the specific works for the minionId
minionRouter.get("/:minionId/work", (req, res, next) => {
  // get the array of works for the minion
  const works = getAllFromDatabase("work").filter((work) => 
  work.minionId == req.id);

  // respond with the works
  res.send(works);
})

// POST create a work for the specified id
minionRouter.post("/:minionId/work", (req, res, next) => {

  // validate the data from the body req
  const validData = validateWorkData(req.body);

  if(validData) {
    // add the work to database
    const newWork = addToDatabase("work", req.body);

    // respond with the work
    res.status(201).send(newWork);
  } else {
    // response with 400 bas request
    res.status(400).send('Invalid Data');
  }
});

// PUT update by id's the work
minionRouter.put('/:minionId/work/:workId', (req, res, next) => {

  const newWork = updateInstanceInDatabase("work", req.body);

  if(newWork) {
    res.send(newWork);
  } else {
    res.status(400).send();
  }

});

// DELETE the work by id in the corresponding minionId
minionRouter.delete("/:minionId/work/:workId", (req, res, next) => {

  deleteFromDatabasebyId("work", req.WorkId);

  res.status(204).send("Successfully deleted");
})



module.exports = minionRouter;