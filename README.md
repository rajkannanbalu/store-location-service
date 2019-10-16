
### Simple Store Location Server

> Simple Store Location Service

## Getting Started

> [[Technologies](#technologies-used) &middot; 
  [Testing Tools](#testing-tools) &middot; 
  [Installations](#installations) &middot; 
  [API Endpoints](#api-endpoints) &middot; 
  [Tests](#tests) &middot; 
  [Author](#author)


## Technologies Used

[node]: (https://nodejs.org)

- [Node.js](node)
- [postgreSQL](node)
- [Express.js](https://expressjs.com).
- [Sequelize ORM] 

## Testing Tools

- [Mocha](https://mochajs.org/).
- [Chai](https://chaijs.com).

## Installations

#### Getting started

- You need to have Node and NPM installed on your computer.
- Installing [Node](node) automatically comes with npm.

#### Clone

- Clone this project to your local machine `git@github.com:rajkannanbalu/store-location-service.git`

#### prerequisite (only for testing and if needed run for dev also)
(Since I am using Online database for development server, for running test cases, you need to install the below tools in your local machine)
- Install postgresql
 > Run the command below
  ```shell
  (Ubuntu)
  $ sudo apt update 
  $ sudo apt install postgresql postgresql-contrib
  (Mac)
  $ brew install postgres
  ```
- Install postgis
 > Run the command below
  ```shell
  (Ubuntu)  
  $ sudo apt-get install postgis
  (Mac)
  $ brew install postgis
  ```  
- Install pgloader (migration data tool)
 > Run the command below
  ```shell
  (Ubuntu)  
  $ sudo apt-get install pgloader
  (Mac)
  $ brew install pgloader
  ```    
(Any issues in installing postgresql or postgis, please refer below link: (https://medium.com/@Umesh_Kafle/postgresql-and-postgis-installation-in-mac-os-87fa98a6814d) (for mac))  

#### Setup

- Installing the project dependencies
  > Run the command below
  ```shell
  $ npm install
  ```
- Start your node server
  > run the command below
  ```shell
  $ npm run dev
  ```
- Use `http://localhost:8000` as base url for endpoints


#### Setting up initial database for migrating data

- Start postgres server
  > Run the command below
  ```shell
  $ pg_ctl -D /usr/local/var/postgres start && brew services start postgresql (Mac)
  ```
- Create databases (stores, stores_test)
  > run the command below
  ```shell
  $ createdb stores
  $ createdb stores_test
  ```
(Note: For running server, it uses online database. If you want to use local database(stores), please change config.js development object)

- Get superuse of postgres
  > run the command below
  ```shell
  $ psql postgres
  $ postgres=# \du  
  ```

  Get any superuser name and remember it, since it is needed to migrate data using pgloader

### Migrate Data to Postgresql
- Configure Postgres superuser and user
    -> open pgloader.ini and change
    ```   SUPERUSER=${Your POSTGRES SuperUser}
          USER=${YourFavouriteName(anything)}
    ```   
- Migrate Data from CSV to PSQL 
  > Run the command below
  ```shell
  $ pgloader --context pgloader.ini sqlDev.load (development)
  $ pgloader --context pgloader.ini sqlTest.load (test)
  $ pgloader --context pgloader.ini sqlOnline.load (online) 
  ```
(Please note that, i have already moved data to online database using the above script)

## API Endpoints

| METHOD | DESCRIPTION                             | ENDPOINTS                 |
| ------ | --------------------------------------- | ------------------------- |
| POST   | Add new store                           | `/v1/closest`           |
| GET    | Get all stores                        | `/v1/closest/all`           |
| GET    | Get nearest store                        | `/v1/closest?zip|address|unit`           |
| PUT    | Update the details of a store            | `/v1/closest/:storeId`   |
| DELETE | Remove a store                           | `/v1/closest/:storeId`   |


## Tests

- Run test for all endpoints
  > run the command below
  ```shell
  $ npm run test
  ```


## Author

- Raj kannan Balasubramanian
   linkedin: https://www.linkedin.com/in/raj-kannan-balu-24709136/