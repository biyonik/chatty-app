import {
    Application,
    json,
    urlencoded,
    Response,
    Request,
    NextFunction,
} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import compression from 'compression';
import { config } from '@root/config';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import applicationRoutes from '@root/routes';
import {
    CustomError,
    IErrorResponse,
} from '@helpers/error-handler';
import Logger from 'bunyan';

const log: Logger = config.createLogger('SETUP_SERVER');

export class ChattyServer {
    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    /**
     *
     */
    public async start(): Promise<void> {
        this.securityMiddleware(this.app);
        this.standartMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.globalErrorHandler(this.app);
        await this.startServer(this.app);
    }

    /**
     *
     * @param app
     * @private
     */
    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: config.COOKIE_NAME,
                keys: [
                    config.COOKIKE_SECRET_KEY_ONE!,
                    config.COOKIKE_SECRET_KEY_TWO!,
                ],
                maxAge: 24 * 7 * 360000,
                secure: config.NODE_ENV !== 'development',
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: `${config.CLIENT_URL}:${config.CLIENT_PORT}`,
                credentials: true,
                optionsSuccessStatus: 200,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            })
        );
    }

    /**
     *
     * @param app
     * @private
     */
    private standartMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: '50mb' }));
        app.use(
            urlencoded({
                extended: true,
                limit: '50mb',
            })
        );
    }

    /**
     *
     * @param app
     * @private
     */
    private routeMiddleware(app: Application): void {
        applicationRoutes(app);
    }

    /**
     *
     * @param app
     * @private
     */
    private globalErrorHandler(app: Application): void {
        app.all('*', (requestObject: Request, responseObject: Response) => {
            responseObject
                .status(HTTP_STATUS.NOT_FOUND)
                .json({ message: `${requestObject.originalUrl} not found!` });
        });

        app.use(
            (
                error: IErrorResponse,
                requestObject: Request,
                responseObject: Response,
                nextFunction: NextFunction
            ) => {
                log.error(error);
                if (error instanceof CustomError) {
                    return responseObject
                        .status(error.statusCode)
                        .json(error.serializeErrors());
                }
                nextFunction();
            }
        );
    }

    /**
     *
     * @param app
     * @private
     */
    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            const socketIO: Server = await this.createSocketIO(httpServer);
            this.startHttpServer(httpServer);
            this.socketIOConnections(socketIO);
        } catch (error) {
            log.error(error);
        }
    }

    /**
     *
     * @param httpServer
     * @private
     */
    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
            cors: {
                origin: `${config.CLIENT_URL}:${config.CLIENT_PORT}`,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            },
        });
        const pubClient = createClient({
            url: config.REDIS_HOST,
        });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        return io;
    }

    /**
     *
     * @param httpServer
     * @private
     */
    private startHttpServer(httpServer: http.Server): void {
        httpServer.listen(config.SERVER_PORT, () => {
            log.info(`http server listening on port: ${config.SERVER_PORT}`);
        });
    }

    /**
     *
     * @param io
     * @private
     */
    private socketIOConnections(io: Server): void {
        log.info(`socketIOConnection`);
    }
}
