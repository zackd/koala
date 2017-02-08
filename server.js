// "use-strict";

const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2));

//console.log(argv);

const port = argv.port || 8080;
const apiPath = argv.apiPath || '/api/1';
const dataDir = argv.dataDir || './json';


const express = require('express');
const bodyParser = require('body-parser');
const koala = require('./koala.js');

const app = express();
const router = express.Router();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.json({message: 'Koala says hello!'});
});

koala.attach(router, dataDir);

app.use(apiPath, router);

app.use("/media", express.static(__dirname + '/media'));
app.listen(port);

console.log('\nrunning at localhost:' + port + apiPath + ' \n');
