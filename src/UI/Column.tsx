import Token, {TokenStates} from "./Token";
import {useEffect, useState} from "react";
import {GameEvent} from "../Logic/ConnectGame";

function Column(props:any) {
    const [tokenState,setTokenState] = useState<Array<number>>(props.tokens.filter((x:number) => x!==0) )
    const handleClick = () => {
        if (tokenState.filter((x) => x!==0).length >= props.game.getRows() ) return;
        if (props.game.completed ) return;
        tokenState.push(props.game.getCurrentPlayer());
        setTokenState([...tokenState])
        props.onColumnClick( props.column)
    }

    useEffect(() => {
        props.game.subscribeToEvent(GameEvent.Reversal, (placement:any) => {
            let [rColumn,] = placement;
            if ( rColumn-1 === props.column ) {
                tokenState.pop();
                setTokenState([...tokenState])
            }
        })
        if (tokenState.length > 0)  props.game.checkIfConnect();
        return () => {
        }
    }, [props.column, props.game, tokenState]);
    return <div className={"column"}>
        <div style={{padding:"5px"}}>
                <div onClick={handleClick} id={"clickColumn-"+props.column} className={"column token"}>
                    <strong>{props.column+1}</strong>
                </div>
        </div>
        <div id={"column-"+props.column} className={"tokenColumn"}>
        {
            [...Array(props.game.getRows()).keys() ].map((v, row) =>
                <Token key={props.column+':'+v} tokenState={ tokenState[props.game.getRows()-row-1] ?? TokenStates.Empty} />
            )
        }
        <strong>{props.column+1}</strong>
        </div>
    </div>
}

export default Column;