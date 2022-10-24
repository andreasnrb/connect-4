import Token, {TokenStates} from "./Token";
import {useEffect, useState} from "react";
import {GameEvent} from "../Logic/ConnectGame";

function Column(props:any) {
    const game = props.game;
    const [tokenState,setTokenState] = useState<Array<number>>(props.tokens.filter((x:number) => x!==0) )
    const handleClick = () => {
        if (tokenState.filter((x) => x!==0).length >= game.getRows() ) return;
        if (game.completed ) return;
        tokenState.push(props.game.getCurrentPlayer());
        setTokenState([...tokenState])
        props.onColumnClick( props.column)
    }

    useEffect(() => {
        game.subscribeToEvent(GameEvent.Reversal, 'column'+props.column, (placement:any) => {
            let [rColumn,] = placement;
            if ( rColumn-1 === props.column ) {
                tokenState.pop();
                setTokenState([...tokenState])
            }
        })
        game.subscribeToEvent(GameEvent.Reset, 'column'+props.column, () => {
            setTokenState([]);
        });
        if (tokenState.length > 0)  game.checkIfConnect();
        return () => {
            game.unsubscribeFromEvent(GameEvent.Reset, 'column'+props.column)
            game.unsubscribeFromEvent(GameEvent.Reversal, 'column'+props.column)
        }
    }, [props.column, game, tokenState]);
    return <div className={"column"}>
        <div style={{padding:"5px"}}>
                <div onClick={handleClick} id={"clickColumn-"+props.column} className={"column token"}>
                    <strong>{props.column+1}</strong>
                </div>
        </div>
        <div id={"column-"+props.column} className={"tokenColumn"}>
        {
            [...Array(game.getRows()).keys() ].map((v, row) =>
                <Token key={props.column+':'+v} tokenState={ tokenState[game.getRows()-row-1] ?? TokenStates.Empty} />
            )
        }
        <strong>{props.column+1}</strong>
        </div>
    </div>
}

export default Column;