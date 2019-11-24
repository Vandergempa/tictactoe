/**
  * @desc This class is responsible for keeping track of the currentPlayer. Additionally, it contains 
  *  the logic behind choosing the right move (random and unbeatable).
*/

export default class Player {
  constructor(board) {
    this.currentPlayer = "",
      this.setCurrentPlayer = this.setCurrentPlayer.bind(this),
      this.changeCurrentPlayer = this.changeCurrentPlayer.bind(this),
      this.opponentChoice = this.opponentChoice.bind(this),
      this.minimax = this.minimax.bind(this),
      this.board = board
  }
  // Helper function to set the currentPlayer state:
  setCurrentPlayer(newCurrentPlayer) {
    this.currentPlayer = newCurrentPlayer
  }
  // Helper function to change the state for the current player:
  changeCurrentPlayer() {
    return this.currentPlayer === "X" ? this.currentPlayer = "O" : this.currentPlayer = "X"
  }

  // Used to simulate a "dumb" A.I. - used to select the first move for the A.I.,
  // (it is a bit slow otherwise)
  opponentChoice(origBoard) {
    let emptyGridsArray = this.board.getEmptyGrids(origBoard)
    return emptyGridsArray[Math.floor(Math.random() * emptyGridsArray.length)]
  }

  // Unbeatable A.I. - minmax algorithm
  minimax(board, currentPlayer, depth = 0) {
    let player = currentPlayer
    let emptyGridsArray = this.board.getEmptyGrids(board)
    let newBoard = board
    // Checking for winning states 
    // The A.I. is trying to maximize the score, while the human is trying to minimize it
    // If we don't keep track of the depth of the recursion, the A.I. will miss winning moves,
    // trying to stop the opponent from winning instead.
    if (newBoard[this.board.checkForWinner(newBoard)[0]] === "X") {
      return { score: -100 + depth }
    } else if (newBoard[this.board.checkForWinner(newBoard)[0]] === "O") {
      return { score: 100 - depth }
    } else if (emptyGridsArray.length === 0) {
      return { score: 0 }
    }

    // Then we loop through all the empty spots and place the next player on each one of them
    // When the algorithm finds a winning state, it records the score one level up and doesn't 
    // go any further
    let moves = []

    for (let i = 0; i < emptyGridsArray.length; i++) {
      let move = {}
      // The reason we filled the origBoard with numbers. Here we save the index of a possible next
      // move (first available empty grid)
      move.index = newBoard[emptyGridsArray[i]]
      newBoard[emptyGridsArray[i]] = player
      depth++
      if (player === "O") {
        move.score = this.minimax(newBoard, "X", depth).score
      } else if (player === "X") {
        move.score = this.minimax(newBoard, "O", depth).score
      }

      // Then it resets the board to what it was before (removes the added "X" or "O")
      newBoard[emptyGridsArray[i]] = move.index

      depth = 0
      // And pushes the object to the moves array
      moves.push(move);
    }

    // If we don't have an absolute winning move, we choose the most favorable one (best move) from all
    // the stored options.
    // For example: if all the moves lead to the other player winning but one leads to a draw, it chooses
    // the latter
    let bestMove
    if (player === "O") {
      let bestScore = -Infinity
      for (let i = 0; i < moves.length; i++) {
        // If moves has a higher score than bestScore, that score is stored (in case of
        // multiple identical scores, only the first one is stored)
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    } else if (player === "X") {
      let bestScore = Infinity
      for (let i = 0; i < moves.length; i++) {
        // Here it is the opposite
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    }
    return moves[bestMove]
  }
}
