NodeJS Backend
===============

This skeleton (sample) backend service can be used to simply store and retrieve an object.
The object is saved for a specific user and can only be retrieved by the same user. 
This is validated with a google OAuth id_token that is validated. 

The id_token can be retrieved by the client that the user is authenticated on with their google account.

Routes
-----------
- [POST] `http://localhost:3000/idToken={google OAuth user id_token}` 
  - returns the persisted object or 401(unauthorized)
- [GET] `http://localhost:3000/idToken={google OAuth user id_token}`
  - returns the last persisted object/null or 401(unauthorized)
  
Frameworks
----------
- express
- mongodb
- google-auth-library
- nodemon (dev)

Docker
---------
Start the mongodb by calling `docker-compose up -d` in the context of the root of this repo