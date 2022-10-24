import {Board as BoardData, ConnectGame, GameEvent} from '../Logic/ConnectGame';
import Board from "./Board";
import React, {useEffect, useMemo, useState} from "react";
import Button from "./Button";
import GameStorage from "../Logic/Storage";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/**
 * This is the main UI for the game. It handles the board and the players actions.
 *
 * TODO: Add support to display turn number.
 *
 * @param props
 * @constructor
 */
function ConnectGameUI(props:BoardData) {
    const [winner, setWinner] = useState({winner:false, player:0});
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const game = useMemo(() =>
    {
        const game = new ConnectGame(props);
        let storage = new GameStorage();
        storage.getHistory().map((placement:[number,number]) => game.placeToken(placement[0],placement[1]));
        return game;
        }, [props]);

    const gameStorage = useMemo(() => new GameStorage(), []);
    const handlePlacement = ( column:number, player:number ) => {
        game.placeToken(column, player )
    }
    const reversePlacement = () => {
        game.regretLatestMove();
    }
    const resetGame =  () => {
        confirmAlert( {
            title: "Confirm reset",
            message: "Are you sure you want to reset the game?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        gameStorage.setHistory([]);
                        game.reset();
                    }
                },
                {
                    label: "No",
                }
            ]
        })
    }
    useEffect(() => {
        game.subscribeToEvent(GameEvent.Placement, 'uiGame', (placement:any) => {
            setCurrentPlayer(game.getCurrentPlayer());
            gameStorage.addPlacement(placement)
        })
        game.subscribeToEvent(GameEvent.Won, 'uiGame', (result:any) => {
            setWinner({winner:true, player: result.player });
        })
        game.subscribeToEvent(GameEvent.Reversal, 'uiGame', () => {
            setCurrentPlayer(game.getCurrentPlayer())
            gameStorage.removeLatestPlacement();
        })

        return () => {
            game.unsubscribeFromEvent(GameEvent.Placement, 'uiGame')
            game.unsubscribeFromEvent(GameEvent.Won, 'uiGame')
            game.unsubscribeFromEvent(GameEvent.Reversal, 'uiGame')
        }
    },[game, gameStorage])
    return <>
        <Button onClick={resetGame}>Reset Game?</Button>
        <br />
        { winner.winner && <h1><strong>Player { winner.player } has won!</strong></h1>}
        <br />
        { !winner.winner && <Button onClick={reversePlacement}>Regret move</Button> }
        { !winner.winner && currentPlayer && <h1><strong>Current Player {currentPlayer}</strong></h1>}
        { game && <Board game={game} handlePlacement={handlePlacement} /> }
    </>
}

export default ConnectGameUI;