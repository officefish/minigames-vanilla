
const shuffleItems = (items) => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items
}

const buttons = document.querySelectorAll('.reaction-btn')
for (let i = 0; i < buttons.length; ++i) {
    const item = buttons[i]
    item.dataset.indexNumber = i
    item.addEventListener('click', onItemClick)
}

const ITEMS_PATTERN = Array.from({ length: buttons.length }, (_, i) => ({ index: i }))
const shuffled = shuffleItems(ITEMS_PATTERN)



function getRandomTime(startTime, endTime) {
  startTime *= 1000
  endTime *= 1000  
  return Math.floor(Math.random() * (endTime - startTime + 1)) + startTime;
}



function activateItem(item) {
    item.classList.add('accent')
    const icon = item.firstChild
    icon.classList.remove('fa-exclamation')
    icon.classList.add('fa-lightbulb')
    currentItem = item

    timeout = setTimeout(() => {
        if (!currentItem) return
        currentItem.classList.remove('accent')
        currentItem.classList.add('lose')
        currentItem.firstChild.classList.remove('fa-lightbulb')
        currentItem.firstChild.classList.add('fa-face-meh')
        currentItem.removeEventListener('click', onItemClick)
        currentItem = null
        currentIndex = -1
        lose += 1
        if (win + lose === 16) {
            finishGame()
        }
    }, 1000)
}

function onItemClick(e) {
    e.preventDefault()
    const item = e.currentTarget
    const index = item.dataset.indexNumber

    if (Number(index) === Number(currentIndex)) {
        clearTimeout(timeout)
        if (item.classList.contains('accent')) {
            item.classList.remove('accent')
            item.classList.add('win')
            item.firstChild.classList.remove('fa-lightbulb')
            item.firstChild.classList.add('fa-face-smile')
            item.removeEventListener('click', onItemClick)
            currentIndex = -1
            win += 1
            changeValue()
            if (win + lose === 16) {
                finishGame()
            }
        }
        
    }
}

let win = 0
let lose = 0
let currentItem
let currentIndex = -1

const displayTimer = document.querySelector('#timer')
changeValue()

const timer = setInterval(()=> {
    changeValue()
    const last = shuffled.pop()
    if (!last) {
        finishGame()
        return
    } else {
        const lastIndex = last.index
        currentIndex = lastIndex
        activateItem(buttons[currentIndex])
        //console.log('Показывается индекс: ' + lastIndex)
    }
}, getRandomTime(1, 2))

function updateBestResults(lastResult, bestResults) {
  // Check if the last result is better than any of the best results
  for (let i = 0; i < bestResults.length; i++) {
    if (lastResult > bestResults[i]) {
      // Update the best results array with the new result
      bestResults.splice(i, 0, lastResult); // Insert the new result at the correct position
      bestResults.pop(); // Remove the last (smallest) result
      break; // Exit the loop once the update is done
    }
  }
}

function finishGame() {
    clearInterval(timer)   

    let bestResults = localStorage.getItem("game_2_best_results");
    if (!bestResults) {
        bestResults = [0, 0, 0]
    } else {
        bestResults = JSON.parse(bestResults)
    }
    updateBestResults(win, bestResults)
    localStorage.setItem("game_2_best_results", JSON.stringify(bestResults))

    localStorage.setItem("last_result", JSON.stringify(`${win}/${buttons.length}`))
    localStorage.setItem("last_game", 'reaction')

    setTimeout(() => {
        let result = +localStorage.getItem("result")
        result += (win * 3)
        localStorage.setItem("result", result)

        const redirect = localStorage.getItem("redirect")
        window.location.href = redirect;
    }, 2000)
}

function changeValue() {
    displayTimer.innerHTML = `${win}/${buttons.length}`
}