# Atlenta Server

This is the backend server for the Atlenta project, built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/). It provides a robust and scalable API for managing resources and handling authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Migrations](#database-migrations)
- [Running the Application](#running-the-application)
- [Prisma Studio](#prisma-studio)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- [PostgreSQL](https://www.postgresql.org/download/) or any other supported database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jerryheir/atlenta-test.git
   cd atlenta-server

   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up your environment variables by copying .env.example to .env and configuring it with your database connection details and other necessary settings:
   ```
   cp .env.example .env
   ```

## Database Migration

This project uses Prisma to manage database schema changes.

### Creating a Migration

To create a new migration after modifying your Prisma schema:

```
npm run migration:create
# or
yarn migration:create
```

This will generate a new migration file in the prisma/migrations directory.

### Running Migrations

To apply all pending migrations to your development database:

```
npm run migrate
# or
yarn migrate

```

This will generate a new migration file in the prisma/migrations directory.

For production environments:

```
npm run migrate:prod
# or
yarn migrate:prod
```

## Running the Application

Development

    npm run start:dev
    # or
    yarn start:dev

Production

```
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

## Prisma Studio

Prisma Studio is a GUI to view and edit your data with ease:

```
npm run studio
# or
yarn studio
```

This command opens Prisma Studio in your browser, allowing you to interact with your database.

## Running Tests

This project uses Jest for testing. To run tests:

```
npm run test
# or
yarn test
```

To run tests in watch mode:

```
npm run test:watch
# or
yarn test:watch
```

## Environment Variables

The application requires certain environment variables to be set. These are defined in the .env.example file. Here are some of the key variables:

DATABASE_URL: The connection string for your database.
JWT_SECRET: Secret key used for signing JWT tokens.  
PORT: The port on which the server will run.
Ensure you have all necessary variables configured in your .env file.
