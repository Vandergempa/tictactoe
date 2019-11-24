import Board from '../../classes/Board'
import Player from '../../classes/Player'
import Game from '../../classes/Game'
const utils = require('../../utils/utils')

let board, player, game

beforeEach(() => {
  document.body.innerHTML =
    '<div class="dropdown-el">' +
    '<input type="radio" name="gameType" value="humancomputer" checked="checked" id="type-humancomputer"><label' +
    'for="type-humancomputer">Human vs.' +
    'computer</label>' +
    '<input type="radio" name="gameType" value="humanhuman" id="type-humanhuman"><label id="test" for="type-humanhuman">Human vs.' +
    'human</label>' +
    ' <input type="radio" name="gameType" value="computercomputer" id="type-computercomputer"><label' +
    'for="type-computercomputer">Computer vs.' +
    ' computer</label>' +
    '</div>' +
    '<div class="grid-container">' +
    '<div class="grid-item winner" id="0">X</div>' +
    '<div class="grid-item winner" id="1">X</div>' +
    '<div class="grid-item winner" id="2">X</div>' +
    '<div class="grid-item winner" id="3">O</div>' +
    '<div class="grid-item winner" id="4">X</div>' +
    '<div class="grid-item winner" id="5">O</div>' +
    '<div class="grid-item winner" id="6">O</div>' +
    '<div class="grid-item winner" id="7">O</div>' +
    '<div class="grid-item winner" id="8">X</div>' +
    '</div >' +
    '<div class="bottom-container">' +
    '<button class="bottom-container__iconcont 0">' +
    '<i class="fas fa-user-alt fa-6x 0"></i>' +
    '<h5>Human starts(X)</h5>' +
    '</button>' +
    '<h4>Select starting player</h4>' +
    '<button class="bottom-container__iconcont 1">' +
    '<i class="fas fa-desktop fa-6x 1"></i>' +
    '<h5>Computer starts(O)</h5>' +
    ' </button>' +
    '</div>'

  board = new Board(Array.from(Array(9).keys()))
  player = new Player(board)
  game = new Game(board, player)
  utils.changeClasses = jest.fn()
  utils.changeH4Text = jest.fn()
  utils.changeBottomIcons = jest.fn()
})

// I could have taken another route and mock the return values of the mocked functions with
// .mockReturnValue as well in most of the test cases but I only used that for more complicated
// functions, like minimax()

test('should clear the setTimeout functions', () => {
  game.timeOutIds.push(setTimeout(function () {

  }, 300))

  expect(game.timeOutIds.length).toEqual(1)
  // We enable fake timers, which mocks out setTimeout, clearTimeout and other times functions
  jest.useFakeTimers();
  game.removeSetTimeOuts()

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(game.timeOutIds[0]);
})

describe('test the startgame function', () => {
  test('should clear the grids (both the classes and textcontent)', () => {
    const grids = board.gridsArray()
    game.startGame()
    expect(grids[2].classList.length).toBe(1)
    expect(grids[1].textContent).toEqual("")
  })
  test('should call activateListeners', () => {
    game.activateListeners = jest.fn()
    game.startGame()
    expect(game.activateListeners).toHaveBeenCalledTimes(1)
  })
  test('should call setOrigBoard', () => {
    board.setOrigBoard = jest.fn()
    game.startGame()
    expect(board.setOrigBoard).toHaveBeenLastCalledWith(Array.from(Array(9).keys()))
  })
  test('should remove timeOutIds', () => {
    game.timeOutIds = [3, 5, 7, 9]
    game.startGame()
    expect(game.timeOutIds).toEqual([])
  })
})

describe('test the endgame function', () => {
  test('should call changeClasses with "drawtype", changeH4Text and deactivateListeners when' +
    'the game ends in a draw)', () => {
      game.deactivateListeners = jest.fn()
      const grids = board.gridsArray()
      // A board for a draw:
      board.origBoard = ["O", "X", "X", "X", "O", "O", "X", "O", "X"]

      game.endGame(false)
      expect(utils.changeClasses).toHaveBeenLastCalledWith(grids, "drawtype", "draw", "winner")
      expect(utils.changeH4Text).toHaveBeenLastCalledWith("It is a draw!! Select starting player to start a new game", "20px")
      expect(game.deactivateListeners).toHaveBeenCalledTimes(1)

    })
  test('should call changeClasses with "nodrawtype" changeH4Text and deactivateListeners when' +
    'there is a winner)', () => {
      game.deactivateListeners = jest.fn()
      const grids = board.gridsArray()
      // A board for a winning position:
      board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]

      game.endGame([2, 4, 6])
      expect(utils.changeClasses).toHaveBeenLastCalledWith(grids, "nodrawtype", "winner", "draw", [2, 4, 6])
      expect(utils.changeH4Text).toHaveBeenLastCalledWith("We have a winner!! Select starting player to start a new game", "20px")
      expect(game.deactivateListeners).toHaveBeenCalledTimes(1)
    })
})

describe('test the taketurn function', () => {
  test('should put "X" or "O" on board on empty grids', () => {
    game.takeTurn(1, "O")
    expect(board.origBoard[1]).toEqual("O")
  })
  test('should not put "X" or "O" on board on non-empty grids', () => {
    board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]
    game.takeTurn(2, "O")
    expect(board.origBoard[2]).toEqual("X")
  })
})

describe('test the compMove function', () => {
  test('should call takeTurn', () => {
    game.takeTurn = jest.fn()
    player.minimax = jest.fn()
      .mockReturnValue({ index: 3 })
    game.compMove("X", 300)

    expect(game.takeTurn).toHaveBeenLastCalledWith(3, "X");
  })
  test('should call activateListeners and changeCurrentPlayer if the gameType is humancomputer', () => {
    game.gameType = "humancomputer"
    game.takeTurn = jest.fn()
    game.activateListeners = jest.fn()
    player.minimax = jest.fn()
      .mockReturnValue({ index: 3 })
    player.changeCurrentPlayer = jest.fn()

    game.compMove("X", 300)

    expect(game.activateListeners).toBeCalled();
    expect(player.changeCurrentPlayer).toBeCalled();
  })
  test('should call moveOpponent if the gameType is computercomputer', () => {
    player.currentPlayer = "X"
    game.gameType = "computercomputer"
    game.takeTurn = jest.fn()
    game.moveOpponent = jest.fn()

    player.minimax = jest.fn()
      .mockReturnValue({ index: 3 })

    game.compMove("X", 400)

    expect(game.moveOpponent).toBeCalled();
  })
  test('should call the endGame function', () => {
    player.currentPlayer = "X"
    game.takeTurn = jest.fn()
    player.minimax = jest.fn()
      .mockReturnValue({ index: 3 })
    game.endGame = jest.fn()

    game.compMove("X", 400)

    expect(game.endGame).toBeCalled();
  })
})

describe('test the moveOpponent function if the game ended', () => {
  test('should not call setTimeout if someone won the game', () => {
    board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]
    game.moveOpponent("X", 300)
    expect(game.timeOutIds.length).toEqual(0)
  })
  test('should not call setTimeout if the game ended in a draw', () => {
    board.origBoard = ["O", "X", "X", "X", "O", "O", "X", "O", "X"]
    game.moveOpponent("X", 300)
    expect(game.timeOutIds.length).toEqual(0)
  })
})

describe('test the moveOpponent function if the game has not ended', () => {
  test('should call setTimeout', () => {
    game.moveOpponent("X", 300)

    expect(game.timeOutIds.length).toEqual(1)
    // We fast forward any timer functions:
    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  })
  test('should call computerMove', () => {
    game.compMove = jest.fn()

    game.moveOpponent("X", 300)

    jest.runAllTimers();

    expect(game.compMove).toHaveBeenLastCalledWith("X", 300);
  })
})

describe('test the turnClick function', () => {
  test('should not call anything on a non-empty grid', () => {
    board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]
    game.takeTurn = jest.fn()

    game.turnClick({ target: { id: 2 } })

    expect(game.takeTurn).not.toBeCalled()
  })
  test('should call takeTurn and changeCurrentPlayer on an empty grid', () => {
    board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]
    player.currentPlayer = "X"
    game.takeTurn = jest.fn()
    player.changeCurrentPlayer = jest.fn()

    game.turnClick({ target: { id: 1 } })

    expect(game.takeTurn).toHaveBeenLastCalledWith(1, "X")
    expect(player.changeCurrentPlayer).toBeCalled()
  })
  test('should move opponent if there is no winner yet', () => {
    board.origBoard = [0, 1, "X", "X", 4, 5, "X", "O", "O"]
    player.currentPlayer = "X"
    game.opponentsTurn = jest.fn()
    game.takeTurn = jest.fn()

    game.turnClick({ target: { id: 1 } })

    expect(game.opponentsTurn).toBeCalled()
  })
  test('should not move opponent if there is already a winner', () => {
    board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]
    player.currentPlayer = "X"
    game.opponentsTurn = jest.fn()
    game.takeTurn = jest.fn()

    game.turnClick({ target: { id: 1 } })

    expect(game.opponentsTurn).not.toBeCalled()
  })
  test('should call endGame on an empty grid', () => {
    board.origBoard = [0, 1, "X", 3, "X", 5, "X", "O", "O"]
    game.endGame = jest.fn()

    game.turnClick({ target: { id: 1 } })

    expect(game.endGame).toBeCalled()
  })
})

describe('test the setUpGameTypeClick function', () => {
  test('should change expand the dropdown and select a new input', () => {
    const dropDown = document.querySelector(".dropdown-el")
    let event = {
      target: document.getElementById("test"),
      preventDefault: () => { }
    }
    game.setUpGameTypeClick(event)
    expect(dropDown.classList.contains("expanded")).toBe(true)
    expect(event.target.previousElementSibling.checked).toBe(true)
  })
  test('should call removeSetTimeOuts, changeBottomIcons, changeH4Text', () => {
    game.removeSetTimeOuts = jest.fn()
    let event = {
      target: document.getElementById("test"),
      preventDefault: () => { }
    }

    game.setUpGameTypeClick(event)
    expect(utils.changeBottomIcons).toHaveBeenLastCalledWith(game.gameType, utils.changeIcons)
    expect(utils.changeH4Text).toHaveBeenLastCalledWith("Select starting player", "20px")
    expect(game.removeSetTimeOuts).toBeCalled()
  })
  test('should call startGame and deactivateListeners', () => {
    game.deactivateListeners = jest.fn()
    game.startGame = jest.fn()
    let event = {
      target: document.getElementById("test"),
      preventDefault: () => { }
    }

    game.setUpGameTypeClick(event)
    expect(game.deactivateListeners).toBeCalled()
    expect(game.startGame).toBeCalled()
  })
  test('should change the gameType on click', () => {
    let event = {
      target: document.getElementById("test"),
      preventDefault: () => { }
    }

    game.setUpGameTypeClick(event)
    expect(game.gameType).toEqual("humanhuman")
  })
})

describe('test the setUpStartingPlayerClick function', () => {
  test('should change left icon blue, the right icon black and current player to "X" when clicked' +
    'on the left icon', () => {
      const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
      let event = {
        target: bottomIcons[0],
        preventDefault: () => { }
      }
      game.setUpStartingPlayerClick(event)
      expect(bottomIcons[0].style.color).toEqual("rgb(124, 176, 212)")
      expect(bottomIcons[1].style.color).toEqual("black")
      expect(player.currentPlayer).toEqual("X")
    })
  test('should change right icon blue, the left icon black and current player to "O" when clicked' +
    'on the right icon', () => {
      const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
      game.gameType = "humanhuman"
      let event = {
        target: bottomIcons[1],
        preventDefault: () => { }
      }

      game.setUpStartingPlayerClick(event)
      expect(bottomIcons[1].style.color).toEqual("rgb(124, 176, 212)")
      expect(bottomIcons[0].style.color).toEqual("black")
      expect(player.currentPlayer).toEqual("O")
    })
  test('should call removeSetTimeOuts, changeH4Text and startGame', () => {
    const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
    let event = {
      target: bottomIcons[1],
      preventDefault: () => { }
    }
    game.startGame = jest.fn()
    game.removeSetTimeOuts = jest.fn()

    game.setUpStartingPlayerClick(event)
    expect(utils.changeH4Text).toHaveBeenLastCalledWith("Let\'s see who is better", "25px")
    expect(game.removeSetTimeOuts).toBeCalled()
    expect(game.startGame).toBeCalled()
  })
  test('should call takeTurn (computer player) if gametype is "humancomputer" and the clicked' +
    'icon is the one on the right', () => {
      const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
      game.gameType = "humancomputer"
      let event = {
        target: bottomIcons[1],
        preventDefault: () => { }
      }
      game.takeTurn = jest.fn()
      player.changeCurrentPlayer = jest.fn()

      game.setUpStartingPlayerClick(event)
      expect(player.changeCurrentPlayer).toBeCalled()
      expect(game.takeTurn).toBeCalled()
    })
  test('should call takeTurn, changeH4Text, changeCurrentPlayer and opponentsTurn if gametype ' +
    'is "computercomputer" ', () => {
      const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
      game.gameType = "computercomputer"
      let event = {
        target: bottomIcons[1],
        preventDefault: () => { }
      }
      game.takeTurn = jest.fn()
      player.changeCurrentPlayer = jest.fn()
      game.opponentsTurn = jest.fn()

      game.setUpStartingPlayerClick(event)
      expect(player.changeCurrentPlayer).toBeCalled()
      expect(game.takeTurn).toBeCalled()
      expect(utils.changeH4Text).toHaveBeenLastCalledWith("Let\'s see who is the better A.I...", "20px")
      expect(game.opponentsTurn).toHaveBeenLastCalledWith("O", 900)
    })
})

describe('test the event listener functions', () => {
  test('should add an eventListener on the dropdown with setUpGameTypeClick as an argument', () => {
    const dropDown = document.querySelector(".dropdown-el")
    game.setUpGameTypeClick = jest.fn()
    dropDown.addEventListener = jest.fn()

    game.addDropdownListener()
    expect(dropDown.addEventListener).toHaveBeenLastCalledWith("click", game.setUpGameTypeClick)

  })
  test('should add an eventListener on the bottomIcons with setUpStartingPlayerClick as an argument', () => {
    const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
    game.setUpStartingPlayerClick = jest.fn()
    bottomIcons[0].addEventListener = jest.fn()

    game.addBottomIconsEventListeners()
    expect(bottomIcons[0].addEventListener).toHaveBeenLastCalledWith("click", game.setUpStartingPlayerClick)
  })
  test('should add eventListeners on the grids with turnClick as an argument', () => {
    const grids = board.gridsArray()
    game.turnClick = jest.fn()

    for (let i = 0; i < grids.length; i++) {
      grids[i].addEventListener = jest.fn()
    }
    game.activateListeners()
    for (let i = 0; i < grids.length; i++) {
      expect(grids[i].addEventListener).toHaveBeenLastCalledWith("click", game.turnClick)
    }
  })
  test('should remove the eventListeners on the grids with turnClick as an argument', () => {
    const grids = board.gridsArray()
    game.turnClick = jest.fn()

    for (let i = 0; i < grids.length; i++) {
      grids[i].removeEventListener = jest.fn()
    }
    game.deactivateListeners()
    for (let i = 0; i < grids.length; i++) {
      expect(grids[i].removeEventListener).toHaveBeenLastCalledWith("click", game.turnClick)
    }
  })
})
