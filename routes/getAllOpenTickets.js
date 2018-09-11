var express = require('express');
var router = express.Router();
var dbOperations = require('../db/dbOps');
/* GET home page. */
var response = null;
router.get('/', function(req, res, next) {
	//console.log("Reached getAllOpenTickets");
	response = res;
  	getAllOpenTickets(req);
});

openTicketsReply = function(err, val) {
	console.log("Coming back with val " + JSON.stringify(val, null, 2));
	if(err) {
		response.json(err);
	} else {
		response.json(val);
	}
}

getAllOpenTickets = (req) => {
	dbOperations.getAllOpenTickets(openTicketsReply);
}

module.exports = router;
