import {ConnectGame, GameEvent} from "../Logic/ConnectGame";
import Column from "./Column";
import {useEffect, useState} from "react";

interface BoardData {
    game:ConnectGame,
    handlePlacement:Function
}

/**
 * Board renders the complete board and handles the current player display state.
 * CSS class is set based on current player so that the UI adapts.
 *
 * @param boardData
 * @constructor
 */
function Board( boardData:BoardData ) {
    const game = boardData.game;
    const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer());
    const [placements,] = useState(game.getPlacements());
    useEffect(() => {
        game.subscribeToEvent(GameEvent.Placement, 'board', () => {
            setCurrentPlayer(game.getCurrentPlayer())
        })
        game.subscribeToEvent(GameEvent.Reversal, 'board', () => {
            setCurrentPlayer(game.getCurrentPlayer())
        })
        game.subscribeToEvent(GameEvent.Reset, 'board', () => {
            setCurrentPlayer(game.getCurrentPlayer())
        })
        return () => {
            game.unsubscribeFromEvent(GameEvent.Placement, 'board')
            game.unsubscribeFromEvent(GameEvent.Reversal, 'board')
            game.unsubscribeFromEvent(GameEvent.Reset, 'board')
        }
    },[game])
    const columns = [...Array(game.getColumns()).keys() ].map((v) =>
        <Column key={"c"+v} column={v} rows={game.getRows()} tokens={placements[v]}
                game={game}
            onColumnClick={(column:number) => boardData.handlePlacement(column+1, game.getCurrentPlayer())}
        >
        </Column>
    )
    return <div className={"board currentPlayer"+currentPlayer} style={{gridTemplateColumns: "repeat("+game.getColumns()+", 1fr)"}}>
        {
            columns
        }
    </div>
}
export type {BoardData};
export default Board;