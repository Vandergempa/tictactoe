/**
  * @desc Here is where some of the non-class specific functions are kept
*/

// This function removes and adds winner or draw classes to the appropriate grids
export const changeClasses = (grids, type, classToAdd, classToRemove, combination = undefined) => {
  if (type === "nodrawtype") {
    combination.forEach((comb) => {
      grids[comb].classList.add(classToAdd)
      grids[comb].classList.remove(classToRemove)
    })
  } else {
    for (let i = 0; i < grids.length; i++) {
      grids[i].classList.add(classToAdd)
      grids[i].classList.remove(classToRemove)
    }
  }
}

// Helper function to manipulate the DOM (change the icons and the associated iconTexts)
export const changeIcons = (index, replaceWithThis, newTextContent) => {
  const bottomIcons = Array.from(document.querySelectorAll(".bottom-container__iconcont"))
  bottomIcons[index].firstElementChild.classList = ""
  bottomIcons[index].firstElementChild.classList.add("fas", replaceWithThis, "fa-6x", index)
  bottomIcons[index].lastElementChild.textContent = newTextContent
  bottomIcons[index].style.color = "black"
}
// Call changeIcons with a set of arguments based on the gameType:
export const changeBottomIcons = (gameType, changeIcons) => {
  if (gameType === "humanhuman") {
    changeIcons(0, "fa-user-alt", "Human starts(X)")
    changeIcons(1, "fa-user-alt", "Human starts(O)")
  }
  if (gameType === "humancomputer") {
    changeIcons(0, "fa-user-alt", "Human starts(X)")
    changeIcons(1, "fa-desktop", "Computer starts(O)")
  }
  if (gameType === "computercomputer") {
    changeIcons(0, "fa-desktop", "Computer starts(X)")
    changeIcons(1, "fa-desktop", "Computer starts(O)")
  }
}

// Change the text under the bottomIcons:
export const changeH4Text = (content, size) => {
  const h4Text = document.querySelector("h4")
  h4Text.textContent = content
  h4Text.style.fontSize = size
}
