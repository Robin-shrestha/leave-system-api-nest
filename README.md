
### Note: Currently can only be authenticated through Googlo auth.

A nest js application apis to handle the leave management for an organization. This is an headless api.

## Getting started
  ###  Prerequsites: 
    - docker
    - node v20 

1) Clone the repo: ```https://github.com/Robin-shrestha/leave-system-api-nest.git```
2) CD into the directory
3) create a .env file by copyting .env.example and add valid environment values: ```cp .env .env.example```
4) create a .env.docker file by copyting .env.example and add valid environment values: ```cp .env.docker .env.example.docker```
5) Initialize/run the database instance: ```docker compose up``` (make sure that the user created (MYSQL_USER) has the proper grant types)
6) start the application for development: ```npm run start:dev```

for production:
1) build the application : ```npm run build```
2) start prod server: ```npm run start:prod```


### Features:
-  leave [policy based on fiscal year and country
-  heirarchial roles based authorization
-  google oauth authentication 

### References
- NestJs- [Nest JS](https://docs.nestjs.com/)
- Auth- [Roles based Authorization ](https://medium.com/@dev.muhammet.ozen/role-based-access-control-in-nestjs-15c15090e47d)
- Google Oauth- [Google Oauth ](https://medium.com/@flavtech/google-oauth2-authentication-with-nestjs-explained-ab585c53edec)
