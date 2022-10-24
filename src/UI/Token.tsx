/**
 * The state of a token. Chosen to only support 2 players.
 */
enum TokenStates {
    Player1=1,
    Player2,
    Empty
}

/**
 * Represents a token on the board.
 *
 * @param props
 * @constructor
 */
function Token(props:any) {
    let tokenState;
    switch ( props.tokenState ) {
        case TokenStates.Player1:
            tokenState='player1';
            break;
        case TokenStates.Player2:
            tokenState='player2';
            break;
        default:
            tokenState='empty-slot';
    }
    return <div className={'token ' + tokenState } aria-label={tokenState}></div>
}

export {TokenStates}
export default Token;