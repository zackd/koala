## Koala

node server for quickly mocking a rest API with static json.

takes an input dir containing json files
generates routes based on directory structure, for example:

    GET /task             -> ./json/task.json
    GET /task/complete    -> ./json/task/complete.json
    GET /balance          -> ./json/balance.json       

    
