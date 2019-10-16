
### Simple Store Location Server

> Simple Store Location Service

## Getting Started

> [[Technologies](#technologies-used) &middot; 
  [Testing Tools](#testing-tools) &middot; 
  [Installations](#installations) &middot; 
  [API Endpoints](#api-endpoints) &middot; 
  [Tests](#tests) &middot; 
  [Problem Approach] (#problem-approach) &middot;
  [Other Possible Problem Approaches] &middot;
  [TradeOffs] &middot;
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

#### Prerequisite (only for testing and if needed run for dev also)
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

- Get superuser of postgres
  > run the command below
  ```shell
  $ psql postgres
  $ postgres=# \du  
  ```

  Get any superuser name and remember it, since it is needed to migrate data using pgloader

### Migrate Data to Postgresql
- Configure Postgres superuser and user
    -> open pgloader.ini and change
    ```   
          SUPERUSER=${Your POSTGRES SuperUser}
          USER=${YourFavouriteName(anything)}
    ```   
- Migrate Data from CSV to PSQL 
  > Run the command below
  ```shell
  $ pgloader --context pgloader.ini sqlDev.load (development) (If you want to use local database for development purpose)
  $ pgloader --context pgloader.ini sqlTest.load (for test cases)
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

## Coverage
- See the code coverage from /coverage/index.html

## Problem Approach
### Assumptions made: 
    > Considering each store location as point
    > Location service will find nearest based on simple plane geography and find nearest between two points without considering other geo data types like Polygon, Bounding Box, LineString
    > System has to maintain stores information with considering CSV file as base data 
     
- With the stores data given already, I have chosen the approach and storing to Postgres database, which helps users to manage the stores list by adding/modifying/deleting stores on their own easily 
- Since Postgres offers greater performance interms of querying geo locations data with the extension of PostGIS (https://medium.com/@tjukanov/why-should-you-care-about-postgis-a-gentle-introduction-to-spatial-databases-9eccd26bc42b), i have chosen Postgres.

- For the use case of finding nearest existing store location with given zip (or) address location, below steps i have followed
    > Geocode Given zip or address using Google geocode API (https://developers.google.com/maps/documentation/geocoding/intro). There is one more approach to get using OSM(open street maps).
    > Using geocoded location coordinates(lat, lng), i am querying postgres table using PostGIS functions (`ST_Distance function`) 
    > Returning the first accurate result which is sorted already and calculating distance from store location to given zip/address in given unit(mi|km)
    > return formatted json to user 
- Advantage of using PostGIS is, we can store any type of geolocation (Polygon, LineString) and find shortest distance with proper spatial indexing 
- Advantage of this system, will be as a user, you can manage set of stores and we can extend the functionalities like below
      1.) Finding nearest store within some range
      2.) Finding set of stores which is near by and form a group of stores by city,state, country
      3.) With Using PostGIS, it will be highly scalable which helps to execute queries faster
      

 ## Other Possible Problem Approaches
         Since Postgres Querying will consider only Point based locations on plane, it will give shortest distance based on two coordinates.
 So, considering other type of geometry models like Polygon, LineString which helps to identify the exact route from between two locations like google maps considering all streets. 

 - Approach 1:
      We can maintain full geographic location database in Postgres by migrating from OSM or using Pelias (https://github.com/pelias/pelias) with our set of stores informations and helps to find exact nearest store
 - Approach 2:
      Since we stored already store locations inside postgres, to find nearest store , we can query all store locations with given location and find the shortest distance and return the store using manual algorithm or any external library without PostGIS, which can help in limited set of data. Incase of huge data, calculating shortest distance will be slower


                 
## tradeoffs

- There is a limitation of finding nearest store without considering different data types, since we are considering the location as plane 
- Need manual installation and migration of geolocation data to SQL (which is not a tradeoff)


    

## Author

- Raj kannan Balasubramanian
   linkedin: https://www.linkedin.com/in/raj-kannan-balu-24709136/