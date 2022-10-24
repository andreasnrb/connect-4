// noinspection DuplicatedCode

import {ConnectGame} from '../Logic/ConnectGame';

beforeEach(() => {
    // to fully reset the state between tests, clear the storage
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();

    // clearAllMocks will impact your other mocks too, so you can optionally reset individual mocks instead:
    // @ts-ignore
    // localStorage.setItem.mockClear();
});

it( 'should create a board x/y size', () => {
    let board = new ConnectGame( {rows:5, columns:5, connect: 4});
    expect(board.getColumns()).toBe(5)
    expect(board.getRows()).toBe(5)
})

it( 'should place brick a column in 1 by 1', () => {
    let board = new ConnectGame( {rows: 1, columns: 1, connect: 1 });
    let token:number = 1;
    expect(board.placeToken( 0, token) ).toBeFalsy();
    expect(board.placeToken( 2, token) ).toBeFalsy();
    expect(board.placeToken( 1, token) ).toBeTruthy();
    expect(board.placeToken( 1, token) ).toBeFalsy();
})

it( 'should place brick a column in 2 by 2', () => {
    let board = new ConnectGame( {rows:2, columns:2, connect: 2});
    let token:number = 1;
    expect(board.placeToken( 0, token) ).toBeFalsy();
    expect(board.placeToken( 1, token) ).toBeTruthy();
    expect(board.placeToken( 1, token) ).toBeTruthy();
    expect(board.placeToken( 1, token) ).toBeFalsy();
    expect(board.placeToken( 2, token) ).toBeTruthy();
    expect(board.placeToken( 2, token) ).toBeTruthy();
    expect(board.placeToken( 2, token) ).toBeFalsy();
    expect(board.placeToken( 3, token) ).toBeFalsy();
})

it( 'should check if player has won vertical on column 0', () => {
    let board = new ConnectGame( {rows:3, columns:3, connect: 2});
    let player1:number = 1;
    let player2:number = 2;

    expect(board.getColumns()).toBe(3);
    expect(board.getRows()).toBe(3);
    expect(board.getConnect()).toBe(2);
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})
it( 'should check if player has won vertical on column 1', () => {
    let board = new ConnectGame( {rows:3, columns:3, connect: 3});
    let player1:number = 1;
    let player2:number = 2;
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})

it( 'should check if player has won horizontal on row 0', () => {
    let board = new ConnectGame( {rows:3, columns:3, connect: 2});
    let player1:number = 1;
    let player2:number = 2;
    expect(board.getColumns()).toBe(3);
    expect(board.getRows()).toBe(3);
    expect(board.getConnect()).toBe(2);
    expect(board.placeToken( 3, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})

it( 'should check if player has won horizontal on row 1', () => {
    let board = new ConnectGame( {rows:3, columns:3, connect: 3});
    let player1:number = 1;
    let player2:number = 2;
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 3, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 3, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})
it( 'should check if player has won diagonal up on 00 01', () => {
    let board = new ConnectGame( {rows:2, columns:2, connect: 2});
    let player1:number = 1;
    let player2:number = 2;
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})

it( 'should check if player has won diagonal up on 01 11', () => {
    let board = new ConnectGame( {rows:3, columns:4, connect: 3});
    expect(board.getColumns()).toBe(4);
    expect(board.getRows()).toBe(3);
    expect(board.getConnect()).toBe(3);
    let player1:number = 1;
    let player2:number = 2;
    expect(board.placeToken( 3, player1)).toBeTruthy();
    expect(board.placeToken( 4, player2)).toBeTruthy();

    expect(board.placeToken( 4, player1)).toBeTruthy();
    expect(board.placeToken( 1, player2)).toBeTruthy();

    expect(board.placeToken( 3, player1)).toBeTruthy();
    expect(board.placeToken( 3, player2)).toBeTruthy();

    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.placeToken( 2, player2)).toBeTruthy();
    expect(board.placeToken( 4, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})

it( 'should check if player has won diagonal down on 03 30', () => {
    let board = new ConnectGame( {rows:4, columns:4, connect: 3});
    let player1:number = 1;
    let player2:number = 2;
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.placeToken( 1, player2)).toBeTruthy();

    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.placeToken( 2, player2)).toBeTruthy();

    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.placeToken( 2, player2)).toBeTruthy();

    expect(board.placeToken( 3, player1)).toBeTruthy();
    let result = board.checkIfConnect();
    expect(result).toBeTruthy();
    if (typeof result !== "boolean") {
        expect(result.player).toEqual(1);
    } else {
        expect(result).toBeTruthy();
    }
})/**/

it( 'should regret latest move', () => {
    let board = new ConnectGame( {rows:4, columns:4, connect: 3});
    let player1:number = 1;
    let player2:number = 2;
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.regretLatestMove()).toStrictEqual([1,1]);
    expect(board.getHistory().length).toBe(0);
    expect(board.placeToken( 1, player2)).toBeTruthy();
    expect(board.getHistory().length).toBe(1);
    expect(board.free[0]).toBe(1);
    expect(board.getPlacements()[0][1]).toBe(0);
})

/**/it( 'should use callback', () => {
    let board = new ConnectGame( {rows:4, columns:4, connect: 3});
    let player1:number = 1;
    const placementFn = jest.fn(() => 'mock content');
    expect(board.placeToken( 1, player1, placementFn)).toBeTruthy();
    expect(placementFn).toHaveBeenLastCalledWith([1,1], board.getPlacements());
    const regretFn = jest.fn(() => 'mock content');
    expect(board.regretLatestMove( regretFn )).toStrictEqual([1,1]);
    expect(regretFn).toHaveBeenLastCalledWith([1,1], board.getHistory(), board.getPlacements());
})/**/