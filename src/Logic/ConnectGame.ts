enum GameEvent {
    Placement,
    Reversal,
    Won,
    Finished
}

class ConnectGame {
    board: Board;
    placements: any;
    free: Array<number>;
    history: Array<any> = [];
    subscriptions: Array<Array<Function>> = [];
    currentPlayer:number = 1;
    completed:boolean=false;
    constructor( board:Board ) {
        console.log("LOADED");
        if ( ! Number.isInteger( board.columns ) ) throw new Error( 'Columns have to be an integer.')
        if ( ! Number.isInteger( board.rows ) ) throw new Error( 'Rows have to be an integer.')
        if ( ! Number.isInteger( board.connect ) ) throw new Error( 'Connect have to be an integer.')
        if ( board.connect > board.rows || board.connect > board.columns ) throw new Error( 'Connect has to be smaller than rows and columns-')
        this.subscriptions[GameEvent.Placement] = [];
        this.subscriptions[GameEvent.Reversal] = [];
        this.subscriptions[GameEvent.Won] = [];
        this.subscriptions[GameEvent.Finished] = [];
        this.board = board;
        this.free = Array.apply(null, Array(this.board.columns )).map( () => 0 )
        this.placements = Array.apply(null, Array(this.board.columns)).map(() => {
            return Array(this.board.rows).map(() => 0);
        })
    }
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getColumns() {
        return this.board.columns;
    }

    getRows() {
        return this.board.rows;
    }

    getConnect() {
        return this.board.connect;
    }

    getBoard() {
        return this.board;
    }

    getPlacements() {
        return this.placements;
    }

    placeToken(column: number, token: number, callback?:Function ) {
        if ( this.completed ) return false;
        if ( ! Number.isInteger( column ) ) throw new Error( 'Column have to be an integer.')
        if ( column < 1 || column > this.board.columns ) return false;
        if ( this.free[column - 1 ] === this.board.rows ) return false;
        this.placements[ column - 1 ][ this.free[ column - 1 ] ] = token;
        this.history.push([column, token]);
        this.free[ column - 1 ]++;
        this.subscriptions[GameEvent.Placement].map((subscribedCallback) => subscribedCallback([column, token], this.placements));
        this.currentPlayer= this.currentPlayer===1?2:1;
        if ( callback ) {
            callback([column, token], this.placements);
        }
        return true;
    }

    subscribeToEvent(event:GameEvent, callback:Function ) {
        this.subscriptions[event].push(callback);
    }

    unsubscribeFromEvent( event:GameEvent ) {
        this.subscriptions[event].pop();
    }

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
            this.subscriptions[GameEvent.Won].map((subscribedCallback) => subscribedCallback(result));
        return result ? result : false;

    }

    getPlayerAt( column:number, row:number ) {
        if ( column < 0 ) return false;
        if ( row < 0 ) return false;
        if ( column >= this.board.columns ) return false;
        if ( row >= this.board.rows ) return false;
        return this.placements[column][row] ?? false;
    }

    public checkVerticalAndHorizontalWinner(cols:number[]) {
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

    regretLatestMove( callback?:Function ) {
        let latest = this.history.pop();
        this.currentPlayer= this.currentPlayer===1?2:1;
        this.subscriptions[GameEvent.Reversal].map((subscribedCallback) => subscribedCallback(latest, this.history, this.placements));
        if ( callback ) {
            callback(latest, this.history, this.placements );
        }
        return latest;
    }

    getHistory() {
        return this.history;
    }
}

interface Coordinate {
    row: number,
    column: number,
}
interface Result {
    start: Coordinate,
    end: Coordinate,
    player: number
}

interface Board {
    rows: number,
    columns: number,
    connect: number
}

export {ConnectGame, GameEvent};
export type { Result, Board };
