## Koala

Quickly mock an API with static json.

Koala takes an input dir containing json files and generates routes based on the directory structure. 

For example:

    GET /api/1/books            -> ./json/books.json
    GET /api/1/books/449        -> ./json/books/449.json
    GET /api/1/balance          -> ./json/balance.json       


### Usage

    Usage: node server.js --dataDir <path> [--apiPath <path>] [--mediaDir <path>] [--port <port>]
    
    --help      Print this help message
    --dataDir   Path to the directory containing the JSON data files (default: ./json)
    --apiPath   Path to the API endpoint (default: /api/1)
    --mediaDir  Path to the directory containing media files (default: ./media)
    --port      Port to listen on (default: 3000)
    
    Example: node server.js --dataDir ./json --apiPath /api/1 --mediaDir ./media --port 3000


    curl http://localhost:3000/api/1/books
    curl http://localhost:3000/api/1/books/449







