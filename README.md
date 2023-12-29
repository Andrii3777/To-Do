## Storage Options
The application supports different storage options for data. This can be configured using the appStorage variable in the code.

```js
// Set the desired storage option
export const appStorage: 'File' | 'Memory' | 'MongoDB' | 'MySQL' = 'MongoDB';
```

Choose one of the following values for appStorage:
- **'File'**: Data will be stored in files. !!!Ensure that a 'files' folder is created in the root directory!!!
- **'Memory'**: Data will be stored in memory.
- **'MongoDB'**: Data will be stored in MongoDB (requires MONGODB_URI).
- **'MySQL''**: Data will be stored in MySQL (requires MySQL configuration).

## Environment Variables

The following environment variables should be defined in your `.env` file:

### Application Configuration
- **APP_PORT**: The port on which your application will listen. Set it to `3005` for example.

### MySQL Configuration
- **MYSQL_ROOT_PASSWORD**: The root password for your MySQL database.
- **MYSQL_DATABASE**: The name of the MySQL database.
- **MYSQL_HOST**: The host where your MySQL server is running.
- **MYSQL_PORT**: The port on which your MySQL server is listening..
- **MYSQL_USERNAME**: The username for MySQL database access.
- **MYSQL_PASSWORD**: The password for MySQL database access.

### MONGO DB Configuration
- **MONGODB_URI**: Connection URI for MongoDB.

## Api Reference
[http://localhost:3005/]

## Running the app with DOCKER
## Installation first time only!

```bash
# create .env file and define all environment variables copyvariables

# run the docker containers with mysql and star-wars-app
$ docker-compose up -d

```

## Running the app (without DOCKER)
## Installation first time only!
```bash
# create .env file and define all environment variables copyvariables and install the dependencies
$ npm install

```

## Running the app

```bash
# run the docker containers with mysql and library-app
$ docker-compose up -d

# run the docker containers with mysql and library-app
# and rebuild images if they have changed
$ docker-compose up -d --build

# watch mode
$ node dist/index.js
```


## Shutdown

```bash
# stop the app in the terminal where it is running
$ CTRL + C

# stop the docker containers with mysql and star-wars-app and all unnecessary volumes
$ docker-compose down -v
```