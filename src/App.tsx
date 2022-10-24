import React, {useEffect, useState} from 'react';
import './App.css';
import ConnectGameUI from "./UI/ConnectGameUI";
import {Board} from "./Logic/ConnectGame";

function App() {
    const [board,setBoard] = useState<Board>();

    useEffect(() => {
        let boardData = window.localStorage.getItem('boardData');
        if ( boardData ) {
            setBoard( JSON.parse( boardData ) );
        } else {
            setBoard( {rows:5,columns:5,connect:4} );
            window.localStorage.setItem('boardData', JSON.stringify( {rows:5,columns:5,connect:4} ) )
        }
    },[])

    return (
        <div className="App">
          <header className="App-header">
            <h1>
                Play Connect 4
            </h1>
          </header>
            <main>
                <section>
                    {board && <ConnectGameUI {...board} ></ConnectGameUI> }
                </section>
            </main>
            <footer>

            </footer>
        </div>
    );
}

export default App;
