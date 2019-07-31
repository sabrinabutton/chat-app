# Using the chat-app on Github.io
## Note
Github pages only supports front-end hosting. The server is not currently hosted and thus, currently, only the front end can be accessed with this repo. I am in progress of finding a host for my node server and will update the repo and change the code accordingly so the backend can run through another host.

## Demo
Click on the link provided at the top of the repository to open the chat-app.

# Development

Before starting, run:

### `yarn start`

To install the node modules.

## Run

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `node server.js`

Starts the backend server

### Using the backend

To use the backend, all instances where socket is called as a URL in the front end as http://*********/messages/api, replace the ********* with localhost:3001 or localhost:port if you change the port variable in server.js 

