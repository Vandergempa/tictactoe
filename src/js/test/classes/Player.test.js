import Board from '../../classes/Board'
import Player from '../../classes/Player'

const board = new Board([])
const player = new Player(board)

beforeEach(() => {
  board.setOrigBoard(Array.from(Array(9).keys()))
  player.setCurrentPlayer("")
})

describe('test the currentPlayer state changes', () => {

  test('should set the currentPlayer state to a new player', () => {
    player.setCurrentPlayer("X")
    expect(player.currentPlayer).toEqual("X")
  })
  test('should change the currentPlayer state to the next player', () => {
    // We don't have to test for edge cases because it will either only be "X" or "O"
    player.setCurrentPlayer("X")
    player.changeCurrentPlayer("O")
    expect(player.currentPlayer).toEqual("O")
  })
})

describe('test the A.I. player behaviour', () => {

  test('should return the index of a random, unoccupied grid on the board', () => {
    let origBoard = ["X", "O", "X", "O", 4, "X", 6, 7, "O"]
    expect([4, 6, 7].includes(player.opponentChoice(origBoard))).toBe(true)
  })
  test('should prevent opponent\'s win when player is about to lose', () => {
    let origBoard = ["X", "X", 2, 3, 4, 5, 6, 7, "O"]
    let origBoard2 = ["X", 1, "O", "X", 4, 5, 6, "O", 8]
    let currentPlayer = "O"
    expect(player.minimax(origBoard, currentPlayer)).toMatchObject({
      index: 2,
      score: expect.any(Number)
    })
    expect(player.minimax(origBoard2, currentPlayer)).toMatchObject({
      index: 6,
      score: expect.any(Number)
    })
  })
  test('if possible, player should try to win instead of preventing opponent from winning', () => {
    let origBoard = ["X", "X", "O", "X", 4, 5, 6, 7, "O"]
    let origBoard2 = ["O", 1, "O", 3, 4, "X", "X", 7, "X"]
    let origBoard3 = ["X", "O", "X", 3, "O", 5, 6, 7, "X"]
    let currentPlayer = "O"

    expect(player.minimax(origBoard, currentPlayer)).toMatchObject({
      index: 5,
      score: expect.any(Number)
    })
    expect(player.minimax(origBoard2, currentPlayer)).toMatchObject({
      index: 1,
      score: expect.any(Number)
    })
    expect(player.minimax(origBoard3, currentPlayer)).toMatchObject({
      index: 7,
      score: expect.any(Number)
    })
  })

})