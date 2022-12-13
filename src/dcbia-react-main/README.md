# DSCI front end

# Installation of the main app

This is the entry point for the dsci app. It mainly containst the landing page and navigation bar and orchestrate components such as login

## Node install 

Install node using node nvm. Follow the instructions [here](https://github.com/nvm-sh/nvm)
Install node version v14.15.5 (it could work with latest but it has not been tested)

```
nvm install v14.15.5
```

## Install dependencies

```
npm install
```

### Authentication/User management react component

[react-hapi-jwt-auth](https://github.com/juanprietob/react-hapi-jwt-auth)

On the back end, this library uses the package [hapi-jwt-couch](https://github.com/juanprietob/hapi-jwt-couch/tree/master/src/hapi-jwt-couch)

# Start development web server

```
npm run start
```

When the server starts, it will open up a tab in your browser at http://localhost:3000 
The axios instance that is created redirects requests to port 8180, the relevant lines of codes are in the App.js file [here](https://github.com/DCBIA-OrthoLab/dsci/blob/master/src/dcbia-react-main/src/App.js#L43-L47)

The next step is to start the react library that contains the views for the web app, primarily the file browser. 


# Start dcbia-react-lib for development

Follow instructions [here](https://github.com/DCBIA-OrthoLab/dsci/tree/master/src/dcbia-react-lib)

# Start the backend server

Follow instructions [here](https://github.com/DCBIA-OrthoLab/dsci/tree/master/src/dcbia-server)
