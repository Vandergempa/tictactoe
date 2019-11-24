/**
  * @desc This class represents the board, contains methods that changes board state and checks for and
  * saves the current winning combination (checks if there is a winner).
*/

export default class Board {
  constructor(origBoard) {
    // We need to have the winning combinations:
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ],
      this.origBoard = origBoard,
      this.checkForWinner = this.checkForWinner.bind(this),
      this.setOrigBoard = this.setOrigBoard.bind(this)
  }

  // We could use a for loop to loop over the NodeList, but it's nicer to work with 
  // arrays instead:
  gridsArray() { return Array.from(document.querySelectorAll('.grid-item')) }
  getEmptyGrids(grids) { return grids.filter((grid) => typeof grid === "number") }

  setOrigBoard(newBoard) {
    this.origBoard = newBoard
  }

  // Helper function for the checkForWinner function:
  isWinningSeries(series) {
    let matches = 0
    for (let i = 0; i < series.length; i++) {
      if (series[i] === series[0] && typeof series[i] !== "number") {
        matches++
      }
      if (matches === 3) return true
    } return false
  }
  // Function to check if there is a winner or not -- needs to be checked after each turn
  checkForWinner(grids) {
    let isThereAWinner = false
    // Now we check each array of the winningCombinations against our grids EXPENSIVE OPERATION!
    this.winningCombinations.forEach((combination) => {
      const series = [grids[combination[0]], grids[combination[1]], grids[combination[2]]]
      // Then we check with the isWinningSeries function if the elements are the same or not: 

      if (this.isWinningSeries(series)) {
        // If true return the winning combination:
        isThereAWinner = combination
      }
    })
    return isThereAWinner
  }
}
