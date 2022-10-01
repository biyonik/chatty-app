import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('SETUP_DATABASE');

export default () => {
    const connect = () => {
        mongoose
            .connect(
                `${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`
            )
            .then(() => {
                log.info('Database connection successful');
            })
            .catch((err) => {
                log.error(`Database connection error: ${err}`);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnect', connect);
};
