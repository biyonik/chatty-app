import express, { Express } from 'express';
import { ChattyServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('APP_INITIALIZATION');

class Application {
    public async initialize(): Promise<void> {
        this.loadConfig();
        await databaseConnection();
        const app: Express = express();
        const server: ChattyServer = new ChattyServer(app);
        await server.start();
    }

    private loadConfig(): void {
        config.validateConfig();
        config.cloudinaryConfig();
    }
}

const application: Application = new Application();
application
    .initialize()
    .then(() => log.info('Application initialized successfully!'))
    .catch((err) => log.error(`Application initialization error: ${err}!`));
