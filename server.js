
const express    = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var app    = express();
var router = express.Router();

var port = process.env.PORT || 8080;
var apiPath = '/api';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var generateRoutesModel = function (dir, apiPath) {
  var routes = {},
      root = dir,

    getRoutes = function(dir, path, content) {
      var relativeDir = (dir !== root) ? dir.replace(root, '') : '';

      path = path ? path +'/'+ relativeDir : relativeDir;
      content = content || [];

      var files = fs.readdirSync(dir);

      for (var i in files){
          var absPath = dir + '/' + files[i],
            tmp,
            ext,
            name;

          if (fs.statSync(absPath).isDirectory()) {
              getRoutes(absPath, path, content);
          }
          else {
              tmp = files[i].split('.');
              ext = tmp.pop();
              name = tmp.join('');

              routes[apiPath + path +'/'+ name] = absPath;
          }
      }

  };

  getRoutes(dir);

  return routes;
};

var injectRoutes = function(router, routes) {
    var i,
      size = routes.length,
      key, value;

    for (key in routes) {
      if (routes.hasOwnProperty(key)) {

        router.get(key, function(req, res) {
          console.log(req.path);

          res.json({message: routes[req.path]});
        });

      }
    }
};

// create a test route
router.get('/', function(req, res) {
    res.json({message: 'Koala says hello!'});
});

var routes = generateRoutesModel('./json', '');

console.log("routes", routes);

injectRoutes(router, routes);


app.use(apiPath, router);
app.listen(port);

console.log('\n running at localhost:'+port + apiPath);
// console.log('\n routes: \n '+apiPath);
console.log('\n');
