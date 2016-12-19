## Koala

node server for quickly mocking a rest API with static json.

takes an input dir containing json files
generates routes based on directory structure, for example:

    ./json/task.json          -> /task
    ./json/task/complete.json -> /task/complete
    ./json/balance.json       -> /balance
