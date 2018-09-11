var express = require('express');
var router = express.Router();
var dbOperations = require('../db/dbOps');

var response = null;
router.post('/', function(req, res, next) {
	response = res;
  	getPhoneNumberDetails(req);
});

phoneNumberReply = function(err, val) {
	//console.log("Coming back with val " + JSON.stringify(val, null, 2));
	if(err) {
		response.json(err);
	} else {
		response.json(val);
	}
}

getPhoneNumberDetails = (req) => {
	dbOperations.getPhoneNumberDetails(req, phoneNumberReply);
}
module.exports = router;
