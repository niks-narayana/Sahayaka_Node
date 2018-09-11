var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.json(getAllTickets()); 
});

var getAllTickets = () => {
	return "Getting all Tickets";
}

module.exports = router;
