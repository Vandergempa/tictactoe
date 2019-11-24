const utils = require('../../utils/utils')

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
    '<div class="grid-item" id="0">X</div>' +
    '<div class="grid-item" id="1">X</div>' +
    '<div class="grid-item" id="2">X</div>' +
    '<div class="grid-item" id="3">O</div>' +
    '<div class="grid-item" id="4">X</div>' +
    '<div class="grid-item" id="5">O</div>' +
    '<div class="grid-item" id="6">O</div>' +
    '<div class="grid-item" id="7">O</div>' +
    '<div class="grid-item" id="8">X</div>' +
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
})

describe('test the changeClasses function', () => {
  test('should add the winner and remove the draw class from the winning grids', () => {
    const grids = Array.from(document.querySelectorAll('.grid-item'))
    utils.changeClasses(grids, "nodrawtype", "winner", "draw", [2, 4, 6])

    expect(grids[2].classList.contains("winner")).toBe(true);
    expect(grids[4].classList.contains("winner")).toBe(true);
    expect(grids[6].classList.contains("winner")).toBe(true);
    expect(grids[7].classList.contains("winner")).toBe(false);
    for (let i = 0; i < grids.length; i++) {
      expect(grids[i].classList.contains("draw")).toBe(false)
    }
  })
  test('should add the draw and remove the winner class from all of the grids', () => {
    const grids = Array.from(document.querySelectorAll('.grid-item'))
    utils.changeClasses(grids, "drawtype", "draw", "winner")

    for (let i = 0; i < grids.length; i++) {
      expect(grids[i].classList.contains("draw")).toBe(true)
    }
    expect(grids[2].classList.contains("winner")).toBe(false);
    expect(grids[4].classList.contains("winner")).toBe(false);
  })
})

describe('test the changeIcons functions', () => {
  test('should make changes to the selected bottomIcon (change the icon, textContent, color)', () => {
    const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))

    utils.changeIcons(0, "fa-user-alt", "Human starts(X)")

    expect(bottomIcons[0].firstElementChild.classList.contains("fa-user-alt")).toBe(true);
    expect(bottomIcons[0].lastElementChild.textContent).toEqual("Human starts(X)");
    expect(bottomIcons[0].style.color).toEqual("black");
  })
})

describe('test the changeBottomIcons function', () => {
  test('should call changeIcons with correct arguments with "humanhuman" gametype', () => {
    utils.changeIcons = jest.fn()
    utils.changeBottomIcons("humanhuman", utils.changeIcons)

    expect(utils.changeIcons).toBeCalledWith(0, "fa-user-alt", "Human starts(X)");
    expect(utils.changeIcons).toBeCalledWith(1, "fa-user-alt", "Human starts(O)");
  })
  test('should call changeIcons with correct arguments with "humancomputer" gametype', () => {
    utils.changeIcons = jest.fn()
    utils.changeBottomIcons("humancomputer", utils.changeIcons)

    expect(utils.changeIcons).toBeCalledWith(0, "fa-user-alt", "Human starts(X)");
    expect(utils.changeIcons).toBeCalledWith(1, "fa-desktop", "Computer starts(O)");
  })
  test('should call changeIcons with correct arguments with "computercomputer" gametype', () => {
    utils.changeIcons = jest.fn()
    utils.changeBottomIcons("computercomputer", utils.changeIcons)

    expect(utils.changeIcons).toBeCalledWith(0, "fa-desktop", "Computer starts(X)");
    expect(utils.changeIcons).toBeCalledWith(1, "fa-desktop", "Computer starts(O)");
  })
})

describe('test the changeH4Text function', () => {
  test('should change the textContent and size of the bottom text', () => {
    let h4Text = document.querySelector("h4")

    utils.changeH4Text("Hello", "25px")
    expect(h4Text.textContent).toEqual("Hello")
    expect(h4Text.style.fontSize).toEqual("25px")
  })
})