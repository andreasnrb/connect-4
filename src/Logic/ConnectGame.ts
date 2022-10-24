/**
 * List of events one can subscribe to.
 */
enum GameEvent {
    Placement,
    Reversal,
    Won,
    Finished,
    Reset
}

/**
 * This is the actual game. The class setups the board and makes sure the provided data is correct.
 * It is made to be optimal when it comes to handling the state of the game.
 * No unnecessary loops and what not when checking for a winning state.
 *
 * TODO: Add support to check if no winning moves left.
 */
class ConnectGame {
    board: Board;
    placements: any;
    free: Array<number>;
    history: Array<any> = [];
    subscriptions: Array<{[k:string]:Function}> = [];
    currentPlayer:number = 1;
    completed:boolean=false;

    /**
     * Setups the game.
     *
     * @param board
     */
    constructor( board:Board ) {
        if ( ! Number.isInteger( board.columns ) ) throw new Error( 'Columns have to be an integer.')
        if ( ! Number.isInteger( board.rows ) ) throw new Error( 'Rows have to be an integer.')
        if ( ! Number.isInteger( board.connect ) ) throw new Error( 'Connect have to be an integer.')
        if ( board.connect > board.rows || board.connect > board.columns ) throw new Error( 'Connect has to be smaller than rows and columns-')
        this.subscriptions[GameEvent.Placement] = {};
        this.subscriptions[GameEvent.Reversal] = {};
        this.subscriptions[GameEvent.Won] = {};
        this.subscriptions[GameEvent.Finished] = {};
        this.subscriptions[GameEvent.Reset] = {};
        this.board = board;
        this.free = Array.apply(null, Array(this.board.columns )).map( () => 0 )
        this.placements = Array.apply(null, Array(this.board.columns)).map(() => {
            return Array(this.board.rows).fill(0);
        })
    }

    /**
     * Return the current player.
     *
     * @return integer
     */
    getCurrentPlayer():number {
        return this.currentPlayer;
    }

    /**
     * Return the number of columns of the board.
     *
     * @return integer
     */
    getColumns():number {
        return this.board.columns;
    }

    /**
     * Return the number of rows of the board.
     *
     * @return integer
     */
    getRows():number {
        return this.board.rows;
    }

    /**
     * Return the number of connecting tokens that results in a winning state.
     *
     * @return integer
     */
    getConnect():number {
        return this.board.connect;
    }

    /**
     * Returns the board setup.
     *
     * @return Board
     */
    getBoard():Board {
        return this.board;
    }

    /**
     * Returns the token placements on the board.
     *
     * @return [[]]
     */
    getPlacements() {
        return this.placements;
    }

    /**
     * Place a token on the board.
     *
     * @fires <GameEvent.Placement> Params [column, player], placements:[]
     * @param column
     * @param player Player number. Should be 1 or 2.
     * @param callback
     */
    placeToken(column: number, player: number, callback?:Function ) {
        if ( this.completed ) return false;
        if ( ! Number.isInteger( column ) ) throw new Error( 'Column has to be an integer.')
        if ( column < 1 || column > this.board.columns ) return false;
        if ( this.free[column - 1 ] === this.board.rows ) return false;
        this.placements[ column - 1 ][ this.free[ column - 1 ] ] = player;
        this.history.push([column, player]);
        this.free[ column - 1 ]++;
        this.currentPlayer= this.currentPlayer===1?2:1;
        Object.values(this.subscriptions[GameEvent.Placement]).map((subscribedCallback) => subscribedCallback([column, player], this.placements));
        if ( callback ) {
            callback([column, player], this.placements);
        }
        return true;
    }

    /**
     * Subscribe to a game event.
     *
     * @param event
     * @param key
     * @param callback
     */
    subscribeToEvent(event:GameEvent, key:string, callback:Function ) {
        this.subscriptions[event][key] = callback;
    }

    /**
     * Unsubscribe from a game event.
     *
     * @param event
     * @param key
     */
    unsubscribeFromEvent( event:GameEvent, key:string ) {
        delete this.subscriptions[event][key];
    }

    /**
     * Check if a winning state has been reached.
     * @fires <GameEvent.Won> Param Result
     */
    checkIfConnect() {
        let cols = [];
        for(let i=0;i<this.getColumns(); i++) {
            if ( this.free[i] ){
                cols[i]= this.free[i];
            }
        }

        let result = this.checkVerticalAndHorizontalWinner(cols);
        if ( ! result ) {
            result = this.checkDiagonalWinner(cols);
        }
        if ( result ) this.completed = true;
        if ( result )
            Object.values(this.subscriptions[GameEvent.Won]).map((subscribedCallback) => subscribedCallback(result));
        return result ? result : false;

    }

    /**
     * Returns which player is at the coordinates.
     *
     * @param column
     * @param row
     */
    getPlayerAt( column:number, row:number ) {
        if ( column < 0 ) return false;
        if ( row < 0 ) return false;
        if ( column >= this.board.columns ) return false;
        if ( row >= this.board.rows ) return false;
        return this.placements[column][row] ?? false;
    }

    checkVerticalAndHorizontalWinner(cols:number[]) {
        let start:Coordinate;
        let end:Coordinate;
        let startX:Coordinate;
        let player = 0;
        let previousPlayerY = 0;
        let lengthX=[];
        let lengthY=0;
        let found = false;
        let winner = 0;
        for( let col=0; col<cols.length && !found;col++) {
            let count = cols[col];
            if ( ! count ) continue;
            lengthY = 0;
            for( let r=0;r<count && !found;r++) {
                player = this.getPlayerAt(col, r);
                if ( previousPlayerY !== player ) {
                    lengthY = 1;
                    previousPlayerY = player;
                    start = {column:col, row:r};
                } else {
                    lengthY++;
                    if ( lengthY === this.board.connect ) {
                        found = true;
                        winner = player;
                        end = {column:col, row:r};
                        break;
                    }
                }
                if ( this.getPlayerAt(col-1, r) !== player ) {
                    lengthX[r] = 1;
                    startX = {column:col-1, row:r};
                } else {
                    lengthX[r]++;
                    if ( lengthX[r] === this.board.connect ) {
                        found = true;
                        winner = player;
                        // @ts-ignore
                        start = startX;
                        end = {column:col-1, row:r};
                        break;
                    }
                }
            }
        }
        // @ts-ignore
        return found ? {start:start, end:end,player: winner} : false;
    }

    checkDiagonalWinner(cols: any[]) {
        let found = false;
        let winner = 0;
        let start:Coordinate;
        let end:Coordinate;
        let startY:Coordinate;
        if ( cols.length<this.board.connect ) return false;
        if ( Math.max(  ...cols ) < this.board.connect) return false;
        for( let col=0; col<this.getColumns() && !found;col++) {
            for( let row=0;row<this.getRows() && !found;row++){
                let player = 0;
                let playerY = 0;
                let previousPlayer = 0;
                let previousPlayerY = 0;
                let lengthY=0;
                let length=0;
                for( let x=col,y=row;y<this.getRows() && x<this.getColumns() && !found;y++,x++){
                    player = this.getPlayerAt(x,y);
                    playerY = this.getPlayerAt(x,this.getRows()-y-1);
                    if ( ! player ) {
                        length=0;
                        previousPlayer = player;
                    } else {
                        if ( previousPlayer !== player ) {
                            length=1;
                            previousPlayer = player;
                            start = {column:x,row:y}
                        } else {
                            length++;
                            if ( length === this.board.connect ) {
                                found = true;
                                winner = player;
                                end = {column:x,row:y}
                                break;
                            }
                        }
                    }
                    if ( ! playerY ) {
                        lengthY=0;
                        previousPlayerY = playerY;
                    } else {
                        if ( previousPlayerY !== playerY ) {
                            lengthY=1;
                            previousPlayerY = playerY;
                            startY = {column:x,row:this.getRows()-y-1}
                        } else {
                            lengthY++;
                            if ( lengthY === this.board.connect ) {
                                found = true;
                                winner = playerY;
                                // @ts-ignore
                                start = startY;
                                end = {column:x,row:this.getRows()-y-1}
                                break;
                            }
                        }
                    }
                }
            }
        }
        // @ts-ignore
        return found ? {start:start, end:end,player: winner} : false;
    }

    /**
     * Reverses the latest move. Reset state to previous placement.
     *
     * @fires <GameEvent.Reversal> Params [column, player], history[], placements:[]
     * @param callback
     */
    regretLatestMove( callback?:Function ) {
        if( this.history.length === 0 ) return [];
        let [column, player] = this.history.pop();
        this.placements[ column - 1 ][ this.free[ column - 1 ] ] = 0;
        this.free[column - 1]--;
        this.currentPlayer= player;
        Object.values(this.subscriptions[GameEvent.Reversal]).map((subscribedCallback) => subscribedCallback([column, player], this.history, this.placements));
        if ( callback ) {
            callback([column, player], this.history, this.placements );
        }
        return [column, player];
    }

    /**
     * Returns the game history. All moves in sequence.
     *
     * @return array<[number,number]>
     */
    getHistory() {
        return this.history;
    }

    /**
     * Resets the game state.
     *
     * @fires <GameEvent.Reset> Params this
     */
    reset() {
        this.placements = Array.apply(null, Array(this.board.columns)).map(() => {
            return Array(this.board.rows).fill(0);
        })
        this.history = [];
        this.currentPlayer = 1;
        this.completed = false;
        this.free = Array.apply(null, Array(this.board.columns )).map( () => 0 )
        Object.values(this.subscriptions[GameEvent.Reset]).map((subscribedCallback) => subscribedCallback(this));
    }
}

/**
 * Coordinate on the board.
 */
interface Coordinate {
    row: number,
    column: number,
}

/**
 * The winning connection. Added start and end coordinates so the UI could highlight winning row.
 * Chose not to implement it.
 */
interface Result {
    start: Coordinate,
    end: Coordinate,
    player: number
}

/**
 * The board requirements.
 */
interface Board {
    rows: number,
    columns: number,
    connect: number
}

export {ConnectGame, GameEvent};
export type { Result, Board };
