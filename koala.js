
const fs = require('fs');

var Koala = function () {
    "use strict";

    console.log("making new koala... \n");
};

Koala.prototype.generateRoutesModel = function (dir, apiPath) {
    "use strict";

    var routes = {},
        root = dir,

        getRoutes = function (dir, path, content) {
            var relativeDir = (dir !== root) ? dir.replace(root, '') : '';

            path = path ? path + '/' + relativeDir : relativeDir;
            content = content || [];

            var files = fs.readdirSync(dir);

            for (var i in files) {
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

                    routes[apiPath + path + '/' + name] = absPath;
                }
            }

        };

    getRoutes(dir);

    return routes;
};

Koala.prototype.injectRoutes = function (router, routes) {
    "use strict";

    for (var route in routes) {
        if (routes.hasOwnProperty(route)) {
            router.get(route, function (request, response) {
                "use strict";

                const filename = routes[request.path];

                console.log('GET '+ request.path +' -> '+ filename);

                const json = JSON.parse(fs.readFileSync(filename, 'utf8'));

                response.json(json);
            });
        }
    }
};

Koala.prototype.attach = function(router, dataDir) {
    "use strict";

    const routes = this.generateRoutesModel(dataDir, '');

    console.log("attach routes: ", routes);

    this.injectRoutes(router, routes);
};


module.exports = new Koala();
