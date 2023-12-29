import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
    APP_PORT: Number(process.env.APP_PORT),
    MONGODB_URI: process.env.MONGODB_URI as string,

    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD as string,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE as string,
    MYSQL_HOST: process.env.MYSQL_HOST as string,
    MYSQL_PORT: Number(process.env.MYSQL_PORT),
    MYSQL_USERNAME: process.env.MYSQL_USERNAME as string,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD as string,
};

export default env;