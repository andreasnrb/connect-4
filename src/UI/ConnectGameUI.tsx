import {Board as BoardData, ConnectGame, GameEvent} from '../Logic/ConnectGame';
import Board from "./Board";
import {useEffect, useMemo, useState} from "react";
import Button from "./Button";

function ConnectGameUI(props:BoardData) {
    const [winner, setWinner] = useState({winner:false, player:0});
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const game = useMemo(() => new ConnectGame(props), [props]);
    const handlePlacement = ( column:number, player:number ) => {
        game.placeToken(column, player )
    }
    const reversePlacement = () => {
        game.regretLatestMove();
    }
    useEffect(() => {
        game.subscribeToEvent(GameEvent.Placement, () => {
            setCurrentPlayer(game.getCurrentPlayer());
        })
        game.subscribeToEvent(GameEvent.Won, (result:any) => {
            setWinner({winner:true, player: result.player });
        })
        game.subscribeToEvent(GameEvent.Reversal, () => {
            setCurrentPlayer(game.getCurrentPlayer())
        })

        return () => {
        }
    },[game])
    return <>
        { winner.winner && <h1><strong>Player { winner.player } has won!</strong></h1>}
        <br />
        { !winner.winner && <Button onClick={reversePlacement}>Regret move</Button> }
        { !winner.winner && currentPlayer && <h1><strong>Current Player {currentPlayer}</strong></h1>}
        { game && <Board game={game} handlePlacement={handlePlacement} /> }
    </>
}

export default ConnectGameUI;