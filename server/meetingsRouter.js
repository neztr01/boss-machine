// require section
const meetingRouter = require('express').Router();
const { 
  addToDatabase,
  getAllFromDatabase,
  deleteAllFromDatabase,
  createMeeting
} =  require('./db');


/* ---------------------------------- manage request here below ------------------- */
// GET the entire array of meetings
meetingRouter.get('', (req, res, next) => {
    res.status(200).send(getAllFromDatabase('meetings'));
})

// POST create a new minion and save in db
meetingRouter.post('', (req, res, next) => {
  const meeting = addToDatabase("meetings", createMeeting());
  res.status(201).send(meeting);
})

// DELETE the entire meetings
meetingRouter.delete('', (req, res, next) => {
    // delete the meetings and save it into a const
    const areDeleted = deleteAllFromDatabase("meetings");

    if(areDeleted.length === 0) {
        res.status(204).send("Successfully deleted");
    } else {
        res.status(404).send("Not Found");
    }
})


module.exports = meetingRouter;