## Description
Grocery List API Assessment for QP

## Prerequisite
  1. Install nodejs
  2. Install @nestjs/cli 
  3. Install Postgres
  4. Create server with name qa-assessment in your postgres
  5. Create database with name grocery in the qa-assessment server 

## Installation
```bash
# to install all dependencies
$ npm install
```

## Database Migrations
```bash
# After creating database server and database within that server run following command
$ npm run migration:up
# this command will migrate all the required tables to your local table to run the api's
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev]
```
