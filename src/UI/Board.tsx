import {ConnectGame, GameEvent} from "../Logic/ConnectGame";
import Column from "./Column";
import {useEffect, useState} from "react";

interface BoardData {
    game:ConnectGame,
    handlePlacement:Function
}

function Board( boardData:BoardData ) {
    const game = boardData.game;
    const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer());
    const [placements,setPlacements] = useState(game.getPlacements());
    useEffect(() => {
        game.subscribeToEvent(GameEvent.Placement, () => {
            setCurrentPlayer(game.getCurrentPlayer())
        })
        game.subscribeToEvent(GameEvent.Reversal, () => {
            setCurrentPlayer(game.getCurrentPlayer())
        })
        return () => {
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