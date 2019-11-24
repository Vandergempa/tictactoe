/**
  * @desc This is the main file where the classes are instantiated and the game is started.
*/

import Board from './classes/Board'
import Player from './classes/Player'
import Game from './classes/Game'

// Dependency injection could be used to define a single container to keep the states in, allowing us to make
// modifications to classes without changing the existing codebase. As this is a small project with
// few components I decided not to use libraries like di4js or Awilix to handle this problem
const board = new Board([])
const player = new Player(board)
const game = new Game(board, player)

// To actually start the game:
game.addBottomIconsEventListeners()
game.addDropdownListener()

