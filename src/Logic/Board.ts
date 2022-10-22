
class Board {
    rows:number;
    columns:number;
    connect:number;
    board: any;
    free: Array<number>;
    history: Array<any> = [];
    constructor( rows: number, columns: number, connect: number ) {
        if ( ! Number.isInteger( columns ) ) throw new Error( 'Columns have to be an integer.')
        if ( ! Number.isInteger( rows ) ) throw new Error( 'Rows have to be an integer.')
        if ( ! Number.isInteger( connect ) ) throw new Error( 'Connect have to be an integer.')
        if ( connect > rows || connect > columns ) throw new Error( 'Connect has to be smaller than rows and columns-')

        this.rows = rows;
        this.columns = columns;
        this.connect = connect;
        this.free = Array.apply(null, Array(this.columns )).map( () => 0 )
        this.board = Array.apply(null, Array(this.columns)).map(() => {
            return Array(this.rows).map(() => 0);
        })
    }

    getColumns() {
        return this.columns;
    }

    getRows() {
        return this.rows;
    }

    getBoard() {
        return this.board;
    }

    placeToken(column: number, token: number) {
        if ( ! Number.isInteger( column ) ) throw new Error( 'Column have to be an integer.')
        if ( column < 1 || column > this.columns ) return false;
        if ( this.free[column - 1 ] === this.rows ) return false;
        this.board[ column - 1 ][ this.free[ column - 1 ] ] = token;
        this.history.push({column, token});
        this.free[ column - 1 ]++;
        return true;
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
        return result ? result : false;

    }

    getPlayerAt( column:number, row:number ) {
        if ( column < 0 ) return false;
        if ( row < 0 ) return false;
        if ( column >= this.columns ) return false;
        if ( row >= this.rows ) return false;
        return this.board[column][row] ?? false;
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
                    if ( lengthY === this.connect ) {
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
                    if ( lengthX[r] === this.connect ) {
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
        if ( cols.length<this.connect ) return false;
        if ( Math.max(  ... cols ) < this.connect) return false;
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
                            if ( length === this.connect ) {
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
                            if ( lengthY === this.connect ) {
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

export {Board};
export type { Result };