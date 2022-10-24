import React from 'react';
import './App.css';
import ConnectGameUI from "./UI/ConnectGameUI";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
            Play Connect 4
        </h1>
      </header>
        <main>
            <section>
                <ConnectGameUI connect={4} columns={5} rows={5}></ConnectGameUI>
            </section>
        </main>
        <footer>

        </footer>
    </div>
  );
}

export default App;
