var express = require('express');
var router = express.Router();
var dbOperations = require('../db/dbOps');

var response = null;
/* GET home page. */
router.post('/', function(req, res, next) {
  var ticketDetails = req.body; 
  response = res;
  createTicket(ticketDetails);
});

createTicketReply = function(err, val) {
	if(err) {
		response.json(err);
	} else {
		response.json(val.Item);
	}
}

var createTicket = (ticketDetails) => {
	dbOperations.createTicket(ticketDetails, createTicketReply);
}
module.exports = router;
