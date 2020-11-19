# Hexed Meadow

[http://hexed-meadow.herokuapp.com/](http://hexed-meadow.herokuapp.com/)

Hexed-Meadow is a game built with [Create React App](https://github.com/facebook/create-react-app) and [Boardgame.io](https://boardgame.io).
For now referred to as CRA and BGIO. It is a turn-based game where players move and attack with their units on a hexagon-grid gameboard.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the CRA app with a BGIO Local server setup, where the players are playing on the same device. This is the fastest and easiest way to work on your game. Since the game files are consumed on the client-side code, there is no compilation step necessary.<br/>

_DEVELOPMENT NOTE_: In `src/game/game.ts` you can toggle the `isDevMode` variable, setting up initial game state for development.

### `npm run devstart`

Starts the CRA app but points the BGIO Client to a locally hosted BGIO Server.

In a seperate terminal, you should run `npm run devserver`.

### `npm run devserver`

Watches your `src/game` folder, compiles and outputs the .js into the `server` folder.

Runs the node server in `devserver.js`, and restarts when it or the game files change.

The devserver does _NOT_ serve the front-end app, that must be started in another terminal with `npm run devstart`.

### `npm test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Compiles the game files, so the server file can read them.

Builds the CRA app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Also see the [BGIO docs on deployment](https://boardgame.io/documentation/#/deployment).

I currently just have a `Procfile` in the root that reads `web: node -r esm server.js`, and the whole repo is off to Heroku, super easy.

### `npm run server`

Test your build locally! This will run the node server from `server.js`, which is the deployment server file. This server is configured to serve the front-end app from the `build` folder when we navigate to http://localhost:8000/ .

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Create-React-App info

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
