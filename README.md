NodeJS Backend
===============

This simple backend service can be used to simply store and retrieve an object.
The object is saved for a specific user and can only be retrieved by the same user. 
This is validated with a Google OAuth id_token that is validated. 

The id_token can be retrieved by the client that the user is authenticated on with their Google account.

Get Started
---------
1. Run the docker-compose configuration, check out the docker section below for more information.
2. In order to be able to validate the Google id_token you would need to register the an OAuth 2.0 client application with Google: https://console.developers.google.com/apis/ 
3. When the client is registered at Google you can download the client-secrets.json, make sure to rename the file to `client-secrets.json` and place the file in the root of this project 
4. execute `npm run dev` to start the service 

When you make changes in the code it will trigger nodemon to automatically restart the service with the changes.

Routes
-----------
- [POST] `http://localhost:3000/idToken={Google OAuth user id_token}` 
  - returns the persisted object or 401(unauthorized)
- [GET] `http://localhost:3000/idToken={Google OAuth user id_token}`
  - returns the last persisted object/null or 401(unauthorized)
  
Dependencies
----------
- express
- mongodb
- google-auth-library
- nodemon (dev)

Docker
---------
Starting the docker-compose configuration that contains the mongodb is easy, just execute this statement in your terminal `docker-compose up -d` in the context of the root of this repo