var express = require('express');
var router = express.Router();
var dbOperations = require('../db/dbOps');

var response = null;
/* GET home page. */
router.post('/', function(req, res, next) {
  var ticketDetails = req.body; 
  response = res;
  updateTicket(ticketDetails);
});

updateTicketReply = function(err, val) {
	console.log("UpdateTicket Coming back with val " + JSON.stringify(val, null, 2));
	if(err) {
		response.json(err);
	} else {
		response.json(val);
	}
}

var updateTicket = (ticketDetails) => {
	dbOperations.updateTicketTable(ticketDetails, updateTicketReply);
}
module.exports = router;
