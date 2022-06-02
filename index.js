// bring in the express server application
let express = require('express');
let app = express();

// use the express router object
let router = express.Router();

let pies = [
    { "id": 1, "name": "Apple"},
    { "id": 2, "name": "Cherry"},
    { "id": 3, "name": "Peach"}
];

//Create Get to return a list of the pies
router.get('/', function(req,res, next) {
    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "All plies retrieved.",
        "data": pies
    });
});

//configure router so all routers are prefixed with /api/v1
app.use('/api/', router); // http://localhost:3000/api/ adds "api"

//create serter to listen on port 3000
var server = app.listen(3000, function() {
    console.log('Node Server is running on http://localhost:3000..');
});
