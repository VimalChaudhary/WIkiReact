var express    = require('express');        // call express
var app        = express();
var request = require('request');                 // define our app using express
var port = process.env.PORT || 8088;        // set our port
var router = express.Router();              // get an instance of the express Router

//using cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//This returns links related to search query 
router.get('/:query', function(req, res) {
  request('https://en.wikipedia.org/w/api.php?action=opensearch&search='+req.params.query, function(error, response, body){
  	if(!error){
      res.json(body);
  	}
	else
  		console.log("error While fetching");
  });
});

//this part gets the data of the page you selected
router.get('/detail/:query', function(req, res) {
  request("http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page="+req.params.query+"&callback=?", function(error, response, body){
    if(!error){
      res.json(body);
    }
  else
      console.log("error While fetching");
  });
});


app.use('/api', router);
app.listen(port);
console.log('Port ' + port + ' is active now');
