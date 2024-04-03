// require section
const ideasRouter = require('express').Router();
// require the database
const { 
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require('./db.js');

/*------------------------------------------------------------- */

const validateData = (obj) => {

    if(
      typeof obj.name !== "string" ||
      typeof obj.description !== "string" ||
      isNaN(parseInt(obj.numWeeks)) ||
      isNaN(parseInt(obj.weeklyRevenue))
    ) {
      return false
    } else {
      return true;
    }
  
  }
  
/* ----------------- additional middlewares ---------------------- */

ideasRouter.param('ideasId', (req, res, next, id) => {

  // check if the id is valid
  const validIdea = getFromDatabaseById("ideas", id);

  if(validIdea) {
    // attach the idea to the req
    req.idea = validIdea;
    // attach the id to the req
    req.id = id;
    // pass to the next middleware
    next();
  } else {
    res.status(404).send("Not Found");
  }

})


/* ----------------------- manage the requests ------------------- */

/*
idea structure
- Idea
  - id: string
  - name: string
  - description: string
  - numWeeks: number
  - weeklyRevenue: number
*/

// GET the entire array of ideas
ideasRouter.get('', (req, res, next) => {
  res.status(200).send(getAllFromDatabase('ideas'));
})


// POST create a new idea and save in db
ideasRouter.post('', (req, res, next) => {
    const data = req.body;
    // check if the data is valid and save the response to isValid const
    const isValid = validateData(data);

    // check if the response is true
    if(isValid) {
      // call addToDataBase passing the obj
      const objectCreated = addToDatabase("ideas", data);
      // response with code 200
      res.status(201).send(objectCreated);
    } else {
      // response with 400 bas request
      res.status(400).send('Invalid Data');
    }
})

// GET a single idea by ID
ideasRouter.get("/:ideasId", (req, res, next) => {
  // respond with the actual idea
  res.send(req.idea);
});


// PUT update idea by ID
ideasRouter.put("/:ideasId", (req, res, next) => {
  // update the idea
  const ideaUpdated = updateInstanceInDatabase("ideas", req.body);
  // response with the updated version
  res.status(200).send(ideaUpdated);
});

// DELETE by id any idea valid
ideasRouter.delete("/:ideasId", (req, res, next) => {
  // use the delete function
  deleteFromDatabasebyId("ideas", req.id);
  // send the response
  res.status(204).send("Successfully deleted");
})


module.exports = ideasRouter;