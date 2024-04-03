const express = require('express');
const app = express();
// Requires section
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('express-error-handler');


app.use(express.static(__dirname));

// require the modules path
const minionRouter = require('./server/minionsRouter');
const ideasRouter = require('./server/ideasRouter');
const meetingRouter = require('./server/meetingsRouter');

module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

// Error handler
app.use(errorHandler({
  log: true
}));

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
// set the starting point of the server for all the api routes
app.use('/api', apiRouter);


// Mount router minions
app.use('/minions', minionRouter);
// Mount router ideas
app.use('/ideas', ideasRouter);
// Mount router meetings
app.use('/meetings', meetingRouter);


// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
