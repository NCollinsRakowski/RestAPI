/* // this is here because you can call straight from a js file
let pieRepo = {
    get: function() {
        return [
            {"id": 1, "name": "Apple"},
            {"id": 2, "name": "Cherry"},
            {"id": 3, "name": "Peach"}
        ];
    }
};
*/ 

// this is to read from the pies.json file in assets

let fs = require('fs'); // build in module that knows how to work and read with files

const FILE_NAME = './assets/pies.json';

let pieRepo = {
    get: function(resolve, reject) {
        fs.readFile(FILE_NAME, function(err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    },
    getById: function(id, resolve, reject) {
        fs.readFile(FILE_NAME, function(err, data) { // reject data based on an error
            if(err) {
                reject(err);
            }
            else {
                let pie = JSON.parse(data).find(p => p.id == id); // parse data and put it into a json object
                resolve(pie);
            }
        });
    },
    search: function (searchObject, resolve, reject) { // pass in search object
        fs.readFile(FILE_NAME, function(err, data) { // read the file
            if (err) { // check fir search object
                reject(err);
            }
            else {
                let pies = JSON.parse(data);
                if (searchObject) {
                    pies = pies.filter(
                        p => (searchObject.id ? p.id == searchObject.id : true) && 
                            (searchObject.name ? p.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >= 0: true));

                }
                resolve(pies);
            }
        });
    },
    insert: function (newData, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) { // read the pie file
            if(err) {
                reject(err);
            }
            else {
                let pies = JSON.parse(data); // parse data
                pies.push(newData); // push newData onto the pies array
                fs.writeFile(FILE_NAME, JSON.stringify(pies), function(err) { // command puts everythiong back into the file
                    if(err) { // reject or resolve depending on what the file data does
                        reject(err);
                    } 
                    else {
                        resolve(newData);
                    }
                });
            }
        });
    },
    update: function(newData, id, resolve, reject) { //pass in changed data and the id of the one we want to change
        fs.readFile(FILE_NAME, function(err, data) { // read data from file
            if (err) {
                reject(err);
            }
            else {
                let pies = JSON.parse(data); // parse data into pies array
                let pie = pies.find(p => p.id == id); // find value based on id
                if (pie) {
                    Object.assign(pie, newData); // anything that is in the current pie will be changed to the new data
                    fs.writeFile(FILE_NAME, JSON.stringify(pies), function(err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(newData)
                        }
                    });
                }
            }
        });
    },
    delete: function(id, resolve, reject) { // just need to pass in id of which one to delete. resolve and reject are always there
        fs.readFile(FILE_NAME, function(err, data) {
            if (err) {
                reject(err);
            }
            else {
                let pies = JSON.parse(data); // convert data to pies array
                let index = pies.findIndex(p => p.id == id); // find index of information in that array where id is equal to id
                if(index != -1) {
                    pies.splice(index,1); // splice removes the value from the array
                    fs.writeFile(FILE_NAME, JSON.stringify(pies), function(err) { //write the file pack with the new array
                        if(err) {
                            reject(err);
                        }
                        else {
                            resolve(index);
                        }
                    });
                }
            }
        });
    }
};


module.exports = pieRepo;