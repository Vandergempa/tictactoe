import Board from '../../classes/Board'

const board = new Board(Array.from(Array(9).keys()))

beforeEach(() => {
  board.setOrigBoard(Array.from(Array(9).keys()))
})

describe('test the board setup', () => {

  test('should get the empty grids on the board (an array of type numbers only)', () => {
    expect(board.getEmptyGrids(board.origBoard)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })
  test('should set/change the origBoard state', () => {
    board.setOrigBoard([0, "X", 2, "O", 4, "X", 6, "X", "X"])
    expect(board.origBoard).toEqual([0, "X", 2, "O", 4, "X", 6, "X", "X"])
  })
})

describe('test the winning conditions', () => {

  test('should return true if the input contains three "X" or "O"-s, false otherwise)', () => {
    expect(board.isWinningSeries(["X", "X", "X"])).toBe(true)
    expect(board.isWinningSeries(["O", "X", "X"])).toBe(false)
  })
  test('should return false if there is no winner)', () => {
    expect(board.checkForWinner([0, "X", 2, "O", 4, "X", 6, "X", 8])).toBe(false)
  })
  test('should return the winning combination if there is a winner)', () => {
    expect(board.checkForWinner([0, "X", 2, "O", "X", "O", 6, "X", 8])).toEqual([1, 4, 7])
    expect(board.checkForWinner([0, "X", "O", "X", "O", "O", 6, "X", "O"])).toEqual([2, 5, 8])
  })

})
