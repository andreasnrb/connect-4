/**
 * Simple wrapper class to handle local storage of the game state.
 */
class GameStorage {
    addPlacement(placement:[number,number]) {
        let history = this.getHistory();
        history.push(placement);
        this.setHistory(history);
    }
    removeLatestPlacement() {
        let history = this.getHistory();
        history.pop();
        this.setHistory(history);
    }
    setHistory(history:[]) {
        localStorage.setItem('history', JSON.stringify(history));
    }
    getHistory() {
        let historyString = localStorage.getItem('history') ?? JSON.stringify([]);
        return JSON.parse(historyString);
    }
}

export default GameStorage;