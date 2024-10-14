import parseArgs from 'minimist';
import express from 'express';
import morgan from 'morgan';
import bodyParser from "body-parser";
import koala from './koala.js';

const argv = parseArgs(process.argv.slice(2));

//console.log(argv);

const port = argv.port || 3000;
const apiPath = argv.apiPath || '/api/1';
const dataDir = argv.dataDir;
const mediaDir = argv.mediaDir;

if (argv.help || !dataDir) {
    console.log(`
        Usage: node server.js --dataDir <path> [--apiPath <path>] [--mediaDir <path>] [--port <port>]
        
        --help      Print this help message
        --dataDir   Path to the directory containing the JSON data files (default: ./json)
        --apiPath   Path to the API endpoint (default: /api/1)
        --mediaDir  Path to the directory containing media files (default: ./media)
        --port      Port to listen on (default: 3000)
        
        Example: node server.js --dataDir ./json --apiPath /api/1 --mediaDir ./media --port 3000
    `);
    process.exit(1);
}

const app = express();
const router = express.Router();
const httpLogger = morgan(':method :url :status :response-time ms - :res[content-length] - :user-agent');

app.use(httpLogger);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.json({message: 'Koala says hello!'});
});


const k = new koala();
k.attach(router, dataDir, apiPath);

app.use('', router);

if (mediaDir) {
    app.use(mediaDir, express.static(__dirname + '/media'));
}

// any unmatched routes get 404...
app.use((req, res, next) => {
    res.status(404).json({message: "Sorry can't find that!"});
})

app.listen(port);

console.log('\nrunning at localhost:' + port + apiPath + ' \n');
