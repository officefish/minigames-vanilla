
let currentTime = 0
let counter = 0
let game = true

const displayTimer = document.querySelector('#timer')
const displayCounter = document.querySelector('#counter')
const clicker = document.getElementById('clicker')

clicker.onclick = () => {
    if (!game) return
    counter++
    displayCounter.innerHTML = counter
}

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

const finishGame = () => {
    clearInterval(intervalId)
    game = false
    
    let bestResults = localStorage.getItem("game_1_best_results");
    if (!bestResults) {
        bestResults = [0, 0, 0]
    } else {
        bestResults = JSON.parse(bestResults)
    }
    updateBestResults(counter, bestResults)
    localStorage.setItem("game_1_best_results", JSON.stringify(bestResults))

    //console.log("Updated Best Results:", bestResults)

    localStorage.setItem("last_result", JSON.stringify(counter))
    localStorage.setItem("last_game", 'clicker')

    const redirect = localStorage.getItem("redirect")
    

    let result = +localStorage.getItem("result")
    result += counter 


    localStorage.setItem("result", result)

    setTimeout(() => {
        window.location.href = redirect;
    }, 2000)
}

