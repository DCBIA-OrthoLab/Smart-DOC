# DSCI front end

# Installation of the main app

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

# Start development web server

```
npm run start
```

When the server starts, it will open up a tab in your browser at http://localhost:3000 
The axios instance that is created redirects requests to port 8180, the relevant lines of codes are in the App.js file [here](https://github.com/DCBIA-OrthoLab/dsci/blob/master/src/dcbia-react-main/src/App.js#L43-L47)

The next step is to start the react library that contains the views for the web app, primarily the file browser. 
