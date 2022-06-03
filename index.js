// bring in the express server application
let express = require('express');
let app = express();
let pieRepo = require('./localrepos/pieRepo');

// use the express router object
let router = express.Router();
//let pies = pieRepo.get(); // synchronous call

// Configure middleware to support JSON data parsing in request object. this allows for POST to be used
app.use(express.json());

//Create Get to return a list of the pies
router.get('/', function(req,res, next) {
    pieRepo.get(function(data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        });
    }, function(err) {
        next(err);
    });
});

router.get('/search', function (req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search(searchObject, function(data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

router.get('/:id', function(req,res, next) {
    pieRepo.getById(req.params.id, function(data) {
        if (data) { // if data is found
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All pies retrieved.",
                "data": data
            });
        } 
        else { // if data is not found
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error" : {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + ", could not be found."
                }
            });
        }
    }, function(err) { // error and passed to the next call back
        next(err);
    });
});

router.post('/', function (req, res, next) {
    pieRepo.insert(req.body, function(data) { //put the body of the data into a pie data object
        res.status(201).json({ // Data was created message
            "status": 201,
            "statusText": "Created",
            "message": "New Pie Added.",
            "data": data
        });
    }, function(err) {
        next(err);
    });
})

router.put('/:id', function(req, res, next) { // maps the new value to this parameter id/name
    pieRepo.getById(req.params.id, function(data) { // grabs the ID
        if (data) {
            // Attempt to update the data
            pieRepo.update(req.body, req.params.id, function(data) {
                res.status(200).json({
                    "status" : 200,
                    "statusText" : "OK",
                    "message": "Pie '" + req.params.id + "' updated.",
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function(err) {
        next(err);
    });
})

router.delete('/:id', function(req, res, next) { // pass in id of which one to remove
    pieRepo.getById(req.params.id, function(data) { // get the id... req.params.id is the id that we pass into the function
        if (data) {
            // Attempt to delete data
            pieRepo.delete(req.params.id, function(data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "The pie '" + req.params.id + "' is deleted.",
                    "data": "Pie '" + req.params.id + "' deleted."
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' count not be deleted.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be deleted."
                }
            });
        }
    }, function(err) {
        next(err);
    });
})

router.patch('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function(data) {
        if(data) {
            pieRepo.update(req.body, req.params.id, function(data) { // same at update but the requirements here are different
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '" + req.params.id + "' patched.",
                    "data": data
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' count not be patched.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be patched."
                }
            });
        }
    }, function(err) {
        next(err);
    });
})


//configure router so all routers are prefixed with /api/v1
app.use('/api/', router); // http://localhost:3000/api/ adds "api"

//create serter to listen on port 3000
var server = app.listen(3000, function() {
    console.log('Node Server is running on http://localhost:3000..');
});
