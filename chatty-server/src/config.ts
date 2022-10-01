import dotenv from 'dotenv';
import bunyan from 'bunyan';

dotenv.config({});

class Config {
    public DATABASE_HOST: string | undefined;
    public DATABASE_PORT: string | undefined;
    public DATABASE_NAME: string | undefined;
    public JWT_SECRET_KEY: string | undefined;
    public NODE_ENV: string | undefined;
    public COOKIKE_SECRET_KEY_ONE: string | undefined;
    public COOKIKE_SECRET_KEY_TWO: string | undefined;
    public COOKIE_NAME: string | undefined;
    public CLIENT_URL: string | undefined;
    public CLIENT_PORT: string | undefined;
    public SERVER_PORT: string | undefined;
    public REDIS_HOST: string | undefined;

    constructor() {
        this.DATABASE_HOST = process.env['DATABASE_HOST'] || '';
        this.DATABASE_PORT = process.env['DATABASE_PORT'] || '';
        this.DATABASE_NAME = process.env['DATABASE_NAME'] || '';
        this.JWT_SECRET_KEY = process.env['JWT_SECRET_KEY'] || '';
        this.NODE_ENV = process.env['NODE_ENV'] || '';
        this.COOKIKE_SECRET_KEY_ONE =
            process.env['COOKIKE_SECRET_KEY_ONE'] || '';
        this.COOKIKE_SECRET_KEY_TWO =
            process.env['COOKIKE_SECRET_KEY_TWO'] || '';
        this.COOKIE_NAME = process.env['COOKIE_NAME'] || '';
        this.CLIENT_URL = process.env['CLIENT_URL'] || '';
        this.CLIENT_PORT = process.env['CLIENT_PORT'] || '';
        this.SERVER_PORT = process.env['SERVER_PORT'] || '';
        this.REDIS_HOST = process.env['REDIS_HOST'] || '';
    }

    public createLogger(name: string): bunyan {
        return bunyan.createLogger({
            name: name,
            level: 'debug',
        });
    }

    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined`);
            }
        }
    }
}

export const config: Config = new Config();
