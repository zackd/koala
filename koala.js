import fs from 'fs';

class Koala {

    constructor() {
        this.routes = {};
        this.rootDataDir = '';
        this.apiPath = '';

        console.log("making new koala... \n");
    }

    getRoutes(dir, path, content) {
        const relativeDir = (dir !== this.rootDataDir) ? dir.replace(this.rootDataDir, '') : '';

        path = path ? path + '/' + relativeDir : relativeDir;
        content = content || [];

        const files = fs.readdirSync(dir);

        files.forEach((filename) => {
            const absPath = dir + '/' + filename;
            let tmp, name;

            if (fs.statSync(absPath).isDirectory()) {
                this.getRoutes(absPath, path, content);

            } else {
                tmp = filename.split('.');
                tmp.pop(); // remove extension
                name = tmp.join('');

                this.routes[this.apiPath + path + '/' + name] = absPath;
            }
        });

        return this.routes
    };

    injectRoutes(router, routes) {
        for (const route in routes) {
            let handler = (request, response) => {
                const filename = routes[request.path];

                console.log('GET '+ request.path +' -> '+ filename);

                const json = JSON.parse(fs.readFileSync(filename, 'utf8'));

                response.json(json);
            };

            // TODO: expose configuration for which routes are POST
            if (route.match(/auth/)) {
                router.post(route, handler);
            } else {
                router.get(route, handler);
            }
        }
    }

    attach(router, dataDir, apiPath) {
        this.rootDataDir = dataDir;
        this.apiPath = apiPath;

        const routes = this.getRoutes(dataDir);

        console.log("attach routes: ", routes);

        this.injectRoutes(router, routes);
    }
}

export default Koala;