# Connect 4

Demo project for working with React. Supports "unlimited" size boards and connects.
Default size is 5 by 5 and connect 4 tokens.

![Screenshot](/screenshot.png "Screenshot")

## Structure

* **App.tsx** Renders the Game UI and sets the initial board config.
* **App.css** The styling of the game.
* Logic
  * **ConnectGame.js:** handles the board state and actions
  * **GameStorage.js:** handles storing minimum data required for board state. Stores data in localStorage.
* UI
  * **ConnectGameUI.tsx:** is the main component that handles the board. Sets starting state and provides placement function.
  * **Button.tsx:** A simple button for clicking.
  * **Board.tsx:** Creates the board you play on. Adds the board columns. (Also has UI state regarding current player, can be moved to ConnectGameUI)
  * **Column.tsx** A column of tokens. Has its own state and click action.
  * **Token.tsx** Tokens are is a representation of the 3 states a placement in a column can have. Empty, Player 1 or Player 2.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
