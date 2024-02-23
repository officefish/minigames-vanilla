
const ITEMS_PATTERN = Array.from({ length: 16 }, (_, i) => ({ pair: Math.floor(i / 2) }))
const NO_GUESSED = Array.from({ length: 16 }, () => (false))

function shuffleItems (items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items
}

const items = shuffleItems(ITEMS_PATTERN)
const guessed = [...NO_GUESSED]

let activePair = -1
let activeIndex = -1
let activeItem

let points = 0

function onItemClick (e) {
    e.preventDefault()

    const item = e.currentTarget
   
    const index = item.dataset.indexNumber
    const pair = item.dataset.pair

    if (activePair == -1) {
        activePair = pair
        activeIndex = index
        activeItem = item
        item.disabled = true
        const icon = item.firstChild
        icon.classList.remove('hidden')
        return
    }

    if(activePair != pair) {
       activeItem.disabled = false
       const icon = activeItem.firstChild
       icon.classList.add('hidden')
       activePair = -1
       activeIndex = -1
       return
    }

    if (activeIndex === index) {
        activeItem.disabled = false
        const icon = activeItem.firstChild
        icon.classList.add('hidden')
        activePair = -1
        activeIndex = -1
        return
    }

    guessed[activeIndex] = true
    guessed[index] = true

    item.disabled = true

    item.removeEventListener('click', onItemClick)
    activeItem.removeEventListener('click', onItemClick)

    item.removeEventListener("mousedown", onItemDown)
    activeItem.removeEventListener("mouseup", onItemUp)
    item.removeEventListener("mousedown", onItemDown)
    activeItem.removeEventListener("mouseup", onItemUp)

    item.classList.add('blocked')
    item.firstChild.classList.add('blocked')
    item.firstChild.classList.remove('hidden')
    activeItem.classList.add('blocked')
    activeItem.firstChild.classList.add('blocked')
    activeItem.firstChild.classList.remove('hidden')

    activePair = -1
    activeIndex = -1

    points += 5

    const continueGame = guessed.includes(false)
    if (!continueGame) {
       finishGame()
        //setIsRunning(false)
        //setIsFinalOpen(true)
    }    
}

function onItemDown (e) {
    e.preventDefault()
    const item = e.currentTarget
    const icon = item.firstChild
    icon.classList.remove('hidden')
}

function onItemUp (e) {
    e.preventDefault()
    const item = e.currentTarget
    const icon = item.firstChild
    icon.classList.add('hidden')
    
    
}

function setupPair (item, index, pair) {
    //console.log(item)
    const icon = item.firstChild

    //console.log(icon)

    let faIconClass
    switch(pair) {
        case 0: {
            faIconClass = 'fa-sun'
            break;
        }
        case 1: {
            faIconClass = 'fa-pen'
            break;
        }
        case 2: {
            faIconClass = 'fa-gear'
            break;
        }
        case 3: {
            faIconClass = 'fa-marker'
            break;
        }
        case 4: {
            faIconClass = 'fa-shield'
            break;
        }
        case 5: {
            faIconClass = 'fa-palette'
            break;
        }
        case 6: {
            faIconClass = 'fa-moon'
            break;
        }
        case 7: {
            faIconClass = 'fa-trash'
            break;
        }
        default: {
            faIconClass = 'fa-sun'
        }
    }

    icon.classList.add('fa-solid')
    icon.classList.add('fa-3x')
    icon.classList.add('text-warning')
    icon.classList.add(faIconClass)

    icon.classList.add('hidden')

    item.dataset.indexNumber = index
    item.dataset.pair = pair

    item.addEventListener('click', onItemClick)
    item.addEventListener("mousedown", onItemDown)
    item.addEventListener("mouseup", onItemUp)
}

/* find all items */
const buttons = document.querySelectorAll('.memory-btn')
for (let i = 0; i < buttons.length; i++) {
    setupPair(buttons[i], i, items[i].pair)
}

const displayTimer = document.querySelector('#timer')
let currentTime = 0

const gameTime = localStorage.getItem("gameTime")

const intervalId = setInterval(() => {
   currentTime++
   
   if (currentTime >= gameTime) {
    finishGame() 
   }

   const time = gameTime - currentTime
   const hours = Math.floor(time / 360000)
   const minutes = Math.floor((time % 360000) / 6000)
   const seconds = Math.floor((time % 6000) / 100)
   const milliseconds = time % 100
   const timeToString = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`

   displayTimer.textContent = timeToString;
  
}, 10) 

function updateBestResults(lastResult, bestResults) {
  // Ensure bestResults is an array
  if (!Array.isArray(bestResults)) {
    bestResults = [];
  }

  // Check if the last result is smaller than any of the best results
  for (let i = 0; i < bestResults.length; i++) {
    if (lastResult < bestResults[i]) {
      // Update the best results array with the new result
      bestResults.splice(i, 0, lastResult); // Insert the new result at the correct position
      bestResults.pop(); // Remove the last (largest) result
      break; // Exit the loop once the update is done
    }
  }
}

function finishGame() {
    
    clearInterval(intervalId)

    setTimeout(() => {
        let result = +localStorage.getItem("result")
        result += points
        localStorage.setItem("result", result)

        const redirect = localStorage.getItem("redirect")
        window.location.href = redirect;
    }, 2000)
    
}