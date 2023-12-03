console.log(`back.ts! 2`);

import { WS_SERVER_PORT } from '@src/port';
// import { createExpressServer } from 'routing-controllers';
// import { ApiUserController } from './controllers/ApiUserController';
// import { ApiAuthController } from './controllers/ApiAuthController';
// import 'reflect-metadata';
// import { logger as loggerMiddleware } from './middleware/logger';

// const app = createExpressServer({
//     cors: {},
//     controllers: [ApiUserController, ApiAuthController],
//     middlewares: [loggerMiddleware]
// });

// app.use(loggerMiddleware);
// app.listen(port);

import { ServerController } from './ServerController';

let server: ServerController;
class Program {
    async main() {
        server = new ServerController(WS_SERVER_PORT);
    }

    static create(): Program {
        return new Program();
    }
}

Program.create().main();
