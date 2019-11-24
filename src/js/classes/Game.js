/**
  * @desc This class is responsible for keeping track of the gameType and the computer player's
  * moves (setTimeOuts). Contains methods necessary to move the players and thus run the game:
  * start or end the game, methods responsible for registering the players' moves and moving 
  * the opponents plus the associated helper functions.
*/

import { changeH4Text, changeClasses, changeIcons, changeBottomIcons } from '../utils/utils'

export default class Game {
  constructor(board, player) {
    this.gameType = "humancomputer",
      this.timeOutIds = [],
      this.turnClick = this.turnClick.bind(this),
      this.setUpGameTypeClick = this.setUpGameTypeClick.bind(this),
      this.setUpStartingPlayerClick = this.setUpStartingPlayerClick.bind(this),
      this.dropDown = document.querySelector(".dropdown-el"),
      this.board = board,
      this.player = player
  }

  // This function is used to stop the computer playing once the grid is cleared
  // (meaning that the dropdown or the bottomIcons are clicked)
  removeSetTimeOuts() {
    for (let i = 0; i < this.timeOutIds.length; i++) clearTimeout(this.timeOutIds[i])
  }

  // Everytime the game restarts we clean up the grid and activate the listeners: 
  startGame() {
    this.board.gridsArray().forEach((grid) => {
      grid.textContent = ""
      grid.classList.remove("winner")
      grid.classList.remove("draw")
    })
    // It's either we generate numbers, "id"-s so we can keep track of the emptyArray 
    // indexes later OR we use the id of the NodeList nodes
    this.board.setOrigBoard(Array.from(Array(9).keys()))
    this.timeOutIds = []
    this.activateListeners()
  }

  // Everytime the game ends in a draw or if there is a winner, we run this function to change the color
  // of the grid content, the textContent of the bottom center text and to deactivate the listeners:
  endGame(winningCombination) {
    const { checkForWinner, getEmptyGrids } = this.board
    const grids = this.board.gridsArray()
    // Check if the game ended in a draw:
    if (getEmptyGrids(this.board.origBoard).length === 0 && !checkForWinner(this.board.origBoard)) {
      changeClasses(grids, "drawtype", "draw", "winner")
      changeH4Text("It is a draw!! Select starting player to start a new game", "20px")
      // We deactivate the listeners so the game can only be started using each of the two bottomIcons
      this.deactivateListeners()
      // Or if there is a winner
    } else if (checkForWinner(this.board.origBoard) !== false) {
      changeClasses(grids, "nodrawtype", "winner", "draw", winningCombination)
      changeH4Text("We have a winner!! Select starting player to start a new game", "20px")
      this.deactivateListeners()
    }

  }

  // Can be called with either the first or the second player. This function places an "X" or an "O"
  // on an empty grid.
  takeTurn(index, letterIcon) {
    if (typeof this.board.origBoard[index] === "number") {
      // We want to keep track of the state of the board as well
      this.board.origBoard[index] = letterIcon
      this.board.gridsArray()[index].textContent = this.board.origBoard[index]
    }
  }

  // When it is the computer player's turn, the minimax function is called, then based on the gameType,
  // we activate the listeners again and change players or let the computer take its turn once more. Plus
  // we check if the game has ended or not and call endGame.
  compMove(oppPlayer, delay) {
    this.takeTurn(this.player.minimax(this.board.origBoard, oppPlayer).index, oppPlayer)
    if (this.gameType === "humancomputer") {
      this.activateListeners()
      this.player.changeCurrentPlayer()
    }
    // We use recursion so that when we have a winner, additional setTimeOut functions
    // are not invoked
    if (this.gameType === "computercomputer") {
      this.moveOpponent(this.player.changeCurrentPlayer(), delay)
    }
    this.endGame(this.board.checkForWinner(this.board.origBoard))
  }

  // Second player (computer) moves if there is no winner and there are still empty grids on the board
  moveOpponent(oppPlayer, delay = 900) {
    const { checkForWinner, getEmptyGrids } = this.board

    if (!checkForWinner(this.board.origBoard) && getEmptyGrids(this.board.origBoard).length !== 0) {
      // We keep the ids of each setTimeOut function, so that we can remove them whenever we want to
      // (it is important to let the user stop the game anytime)
      this.timeOutIds.push(setTimeout(() => this.compMove(oppPlayer, delay), delay))
    }
  }

  opponentsTurn(player, delay) {
    if (this.gameType !== "humanhuman") {
      this.deactivateListeners()
      this.moveOpponent(player, delay)
    }
  }

  // First player moves, currentPlayer is changed then if gameType is not "humanhuman", it is the 
  // computer's turn to move. Then we check if the game has ended or not and call endGame.
  turnClick(event) {
    // Only let movements on empty grids
    if (typeof this.board.origBoard[event.target.id] === "number") {
      this.takeTurn(event.target.id, this.player.currentPlayer)
      this.player.changeCurrentPlayer()
      // By running this conditional check, we run the function each time, we don't have
      // to call it separately.
      if (!this.board.checkForWinner(this.board.origBoard)) {
        // Second player moves
        this.opponentsTurn(this.player.currentPlayer)
      }
      this.endGame(this.board.checkForWinner(this.board.origBoard))
    }
  }

  // The upcoming two functions are the callback functions for the event listeners responsible
  // for starting the game. Here we remove the called setTimeOuts, make changes to the dropdown list
  // and change the gameType based on where it's clicked, change the bottom icons, the bottom center text
  // and call startGame plus we deactivate the listeners
  setUpGameTypeClick(event) {
    const inputField = event.target.previousElementSibling
    const dropDown = document.querySelector(".dropdown-el")
    event.preventDefault()
    this.removeSetTimeOuts()
    dropDown.classList.toggle("expanded")
    inputField.checked = true
    // Save the type of game selected (humanvshuman, humanvscomputer, computervscomputer)
    this.gameType = inputField.value
    changeBottomIcons(this.gameType, changeIcons)
    changeH4Text("Select starting player", "20px")
    this.startGame()
    // We want to start the game by selecting a player first
    this.deactivateListeners()
  }

  // Again we remove the called setTimeOuts, call startGame and based on the icon clicked we change the icons
  // and the currentPlayer. In case the computer starts we call takeTurn with a random index.
  setUpStartingPlayerClick(event) {
    const { changeCurrentPlayer, setCurrentPlayer, opponentChoice } = this.player
    const icon = event.target
    const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
    this.removeSetTimeOuts()
    this.startGame()
    changeH4Text("Let\'s see who is better", "25px")
    if (icon.classList.contains("1")) {
      setCurrentPlayer("O")
      bottomIcons[1].style.color = "#7cb0d4"
      bottomIcons[0].style.color = "black"
      // Player 2 should start this time:
      if (this.gameType === "humancomputer") {
        // First we let the computer randomly choose a grid to speed up the game:
        this.takeTurn(opponentChoice(this.board.origBoard), this.player.currentPlayer)
        // Then it's the other player's turn:
        changeCurrentPlayer()
      }
    } else if (icon.classList.contains("0")) {
      setCurrentPlayer("X")
      bottomIcons[0].style.color = "#7cb0d4"
      bottomIcons[1].style.color = "black"
    }
    // Should run this regardless of which icon is clicked (currentPlayer will change anyway)
    if (this.gameType === "computercomputer") {
      // First the computer chooses a random grid, then it's the opponent's turn with the minimax algorithm.
      changeH4Text("Let\'s see who is the better A.I...", "20px")
      this.takeTurn(opponentChoice(this.board.origBoard), this.player.currentPlayer)
      changeCurrentPlayer()
      this.opponentsTurn(this.player.currentPlayer, 900)
    }
  }
  // These two functions need to be called to start the game!!
  // Adds functionality to the dropdown menu
  addDropdownListener() {
    const dropDown = document.querySelector(".dropdown-el")
    dropDown.addEventListener("click", this.setUpGameTypeClick)
  }

  // Adds functionality to the bottomIcons
  addBottomIconsEventListeners() {
    const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
    bottomIcons.forEach((button) => {
      button.addEventListener("click", this.setUpStartingPlayerClick)
    })
  }

  // We need an event listener on each grid element:
  activateListeners() {
    this.board.gridsArray().forEach((grid) => {
      grid.addEventListener('click', this.turnClick)
    })
  }

  // We also need to remove some of the event listeners:
  deactivateListeners() {
    this.board.gridsArray().forEach((grid) => {
      grid.removeEventListener('click', this.turnClick)
    })
  }
}

