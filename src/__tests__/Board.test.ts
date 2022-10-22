// noinspection DuplicatedCode

import {Board} from '../Logic/Board';
import exp from "constants";
it( 'should create a board x/y size', () => {
    let board = new Board( 5, 5, 4);
    expect(board.getColumns()).toBe(5)
    expect(board.getRows()).toBe(5)
})

it( 'should place brick a column in 1 by 1', () => {
    let board = new Board( 1, 1, 1);
    let token:number = 1;
    expect(board.placeToken( 0, token) ).toBeFalsy();
    expect(board.placeToken( 2, token) ).toBeFalsy();
    expect(board.placeToken( 1, token) ).toBeTruthy();
    expect(board.placeToken( 1, token) ).toBeFalsy();
})

it( 'should place brick a column in 2 by 2', () => {
    let board = new Board( 2, 2, 2);
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
    let board = new Board( 3, 3, 2);
    let player1:number = 1;
    let player2:number = 2;

    expect(board.getColumns()).toBe(3);
    expect(board.getRows()).toBe(3);
    expect(board.connect).toBe(2);
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})
it( 'should check if player has won vertical on column 1', () => {
    let board = new Board( 3, 3, 3);
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
    let board = new Board( 3, 3, 2);
    let player1:number = 1;
    let player2:number = 2;
    expect(board.getColumns()).toBe(3);
    expect(board.getRows()).toBe(3);
    expect(board.connect).toBe(2);
    expect(board.placeToken( 3, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 1, player2)).toBeTruthy();
    expect(board.checkIfConnect()).toBeFalsy();
    expect(board.placeToken( 2, player1)).toBeTruthy();
    expect(board.checkIfConnect()).toBeTruthy();
})

it( 'should check if player has won horizontal on row 1', () => {
    let board = new Board( 3, 3, 3);
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
    let board = new Board( 2, 2, 2);
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
    let board = new Board( 3, 4, 3);
    expect(board.getColumns()).toBe(4);
    expect(board.getRows()).toBe(3);
    expect(board.connect).toBe(3);
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
    let board = new Board( 4, 4, 3);
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