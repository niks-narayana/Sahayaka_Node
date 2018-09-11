var express = require('express');
var router = express.Router();
var response = null;
var dbOperations = require('../db/dbOps');

/* GET home page. */
router.post('/', function(req, res, next) {
	response = res;
  	postPendingTicket(req.body);
});

/* GET home page. */
router.get('/', function(req, res, next) {
	response = res;
  	getPendingTicket();
});

pendingTicketReply = function(err, val) {
	if(err) {
		response.json(err);
	} else {
		response.json(val);
	}
}

var getPendingTicket = () => {
	dbOperations.getPendingTickets(pendingTicketReply);
}

var postPendingTicket = (ticketDetails) => {
	dbOperations.createPendingTicket(ticketDetails, pendingTicketReply);
}
module.exports = router;
