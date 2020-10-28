# Hexed Meadow

Hexed-Meadow is a game built with [Create React App](https://github.com/facebook/create-react-app) and [Boardgame.io](https://boardgame.io), hereafter referred to as CRA and BGIO.

## BGIO

BGIO is a library that takes care of a lot of code pertaining to a game server, keeping players in sync, lobby management, and gives us a framework for making a turn based game.

There is some vocabulary that has specific meaning from the BGIO world. Some big ones are that a bgio-game has its state in two objects: `G` and `ctx`. We manage G, the framework manages ctx (but we can emit `events` from the UI which affect ctx). Players take `turns` making `moves` which can alter G or fire bgio-events. The turns can occur in `phases`, and a turn can be seperated into `stages`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the CRA app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br />
The page will reload if you make edits.<br />
You will also see any lint errors in the console.

_DEVELOPMENT NOTE_: In `src/game/game.ts` you can toggle the `isDevMode` variable. This is used to change the initial state of the game, for development purposes, so we can start in the phase/stage of the game we are working on.

_DEPLOYMENT NOTE_: You can toggle in `App.tsx` the `devMode` variable to serve a staging app instead of the local development version. This will require running devserver.js in another terminal, see `devserver` and `devserver:watch` scripts.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run compile`

Compiles the .ts game files from `src/game/` to .js files in `server/`, because the `server.js`-(production) and `devserver.js`-(staging/dev) files are node apps that needs .js files.

### `npm run compile:watch`

Runs compile above when game files change.

### `npm run devserver`

Runs the node app in `devserver.js`.

### `npm run devserver:watch`

Nodemon watches the compiled .js files in `server/` and runs the 'devserver.js' file, with a one second delay to give the compiler time to run.

### `npm run staging`

Runs the node app in `server.js`, which will serve the app that is in the `build` directory at [http://localhost:3000](http://localhost:3000).

### `npm run build`

Runs `compile`, ignores errors, then runs `cra-build`. Now to test the build locally, you run `npm run start` in one terminal, and in another terminal run `npm run server`

### `npm run cra-build`

Builds the CRA app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
Also see the [BGIO docs on deployment](https://boardgame.io/documentation/#/deployment).

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

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
