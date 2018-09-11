var express = require('express'), bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.text()); // for parsing text

router.post('/', function(req, res, next) {
  var passCode = req.body;
  if(passCode === 'xiniwq')
  	res.json(makeAk());
  else
  	res.sendStatus(403);
});

var makeAk = () => {
  	var akObj = {
  		accessKeyId : process.env.S_K,
  		secretAccessKey : process.env.S_S_K,
  		region : process.env.REGION
  	}
  	return akObj;
}
module.exports = router;
