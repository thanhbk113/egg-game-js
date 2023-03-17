const egg = document.getElementById("egg");
const container = document.getElementById("container");
const optionContainer = document.querySelector(".option-container");
const timer = document.getElementById("timer");
var timeleft = 30; // 30 seconds
var level = 1;
let normalbtn = document.querySelector(".normal-btn");
let hardbtn = document.querySelector(".hard-btn");
let btnplayagain = document.getElementsByClassName("playagain");
let isPlaying = false;
let isEndGame = false;
let eggDied = 0;
egg.addEventListener("touchstart", function (event) {
  event.preventDefault();
  jump();
});

normalbtn.addEventListener("click", function () {
  playnormallevel();
});

hardbtn.addEventListener("click", function () {
  playhardlevel();
});

btnplayagain[0].addEventListener("click", function () {
  window.location.reload();
});

let position = container.offsetWidth / 2.5;
let direction = 1;
let isMovingLeft = false;
let isMovingRight = false;

function moveEgg() {
  if (!isPlaying) return;
  if (isMovingLeft && position > 2) {
    position -= 5;
  } else if (isMovingRight && position < 390) {
    position += 5;
  }
  egg.style.left = position + "px";

  if (position >= container.offsetWidth - egg.offsetWidth) {
    direction = -direction;
  }
}

setInterval(moveEgg, 10);

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    isMovingLeft = true;
  } else if (event.code === "ArrowRight") {
    isMovingRight = true;
  } else if (event.code === "ArrowUp") {
    jump();
  } else if (event.code === "Space") {
    jump();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "ArrowLeft") {
    isMovingLeft = false;
  } else if (event.code === "ArrowRight") {
    isMovingRight = false;
  } else if (event.code === "ArrowUp") {
    setScore();
  } else if (event.code === "Space") {
    setScore();
  }
});

// Touch events
let touchStartX = null;
let touchEndX = null;
let xDown = null;
let yDown = null;

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(evt) {
  if (!isPlaying) return;
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!isPlaying) return;
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      isMovingLeft = true;
    } else {
      /* right swipe */
      isMovingRight = true;
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      jump();
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

document.addEventListener("touchstart", function (event) {
  touchStartX = event.touches[0].clientX;
});

document.addEventListener("touchmove", function (event) {
  event.preventDefault();
  touchEndX = event.touches[0].clientX;
  let distance = touchStartX - touchEndX;
  if (distance > 0 && position > 2) {
    isMovingLeft = true;
    isMovingRight = false;
  } else if (distance < 0 && position < 390) {
    isMovingRight = true;
    isMovingLeft = false;
  }
});

document.addEventListener("touchend", function (event) {
  isMovingLeft = false;
  isMovingRight = false;
  touchStartX = null;
  touchEndX = null;
});

function setScore() {
  document.getElementById("score").innerHTML =
    document.querySelectorAll("#egg1").length + 1;
}

function jump() {
  if (!isPlaying) return;
  let jumpHeight = 100;
  let jumpDuration = 500;

  // Animate the egg's jump
  let start = null;
  function animateJump(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let percent = Math.min(progress / jumpDuration, 1);
    let height = jumpHeight * (1 - percent) * percent;
    egg.style.bottom = height + "px";
    if (percent < 1) {
      window.requestAnimationFrame(animateJump);
    } else {
      // Reset the egg's position when the jump is complete
      egg.style.bottom = "0px";
      // Split the egg into two new eggs
      splitEgg();
      setScore();
    }
  }
  window.requestAnimationFrame(animateJump);
}

function splitEgg() {
  let halfWidth = egg.offsetWidth / 2;
  let halfHeight = egg.offsetHeight / 2;
  // Split the egg into two new eggs
  const newEgg1 = document.createElement("img");
  newEgg1.setAttribute("id", "egg1");
  newEgg1.setAttribute("src", egg.src);
  newEgg1.style.width = halfWidth + "px";
  newEgg1.style.height = halfHeight + "px";
  container.appendChild(newEgg1);

  const newEgg2 = document.createElement("img");
  newEgg2.setAttribute("id", "egg1");
  newEgg2.setAttribute("src", egg.src);
  newEgg2.style.width = halfWidth + "px";
  newEgg2.style.height = halfHeight + "px";
  container.appendChild(newEgg2);

  // Set random positions for the new eggs
  const containerRect = container.getBoundingClientRect();
  const maxLeft = containerRect.width - newEgg1.offsetWidth;
  const maxTop = containerRect.height - newEgg1.offsetHeight;
  newEgg1.style.left = Math.floor(Math.random() * maxLeft) + "px";
  newEgg1.style.top = Math.floor(Math.random() * maxTop) + "px";
  newEgg2.style.left = Math.floor(Math.random() * maxLeft) + "px";
  newEgg2.style.top = Math.floor(Math.random() * maxTop) + "px";
  // Animate and make the new eggs disappear when they are clicked
  newEgg1.addEventListener("click", function () {
    newEgg1.style.animation = "disappear1 1s forwards";
    newEgg1.style.animation = "shake 1.5s ease-in-out forwards";
    newEgg1.src = "break-egg.gif";
    eggDied++;
    setTimeout(function () {
      container.removeChild(newEgg1);
      setScore();
    }, 3000);
  });

  newEgg2.addEventListener("click", function () {
    newEgg2.style.animation = "disappear 1s forwards";
    newEgg2.style.animation = "shake 1.5s ease-in-out forwards";
    newEgg2.src = "break-egg.gif";
    eggDied++;
    setTimeout(function () {
      container.removeChild(newEgg2);
      setScore();
    }, 3000);
  });
  // Randomly determine whether or not to create a boom egg
  if (Math.random() < 0.5) {
    // Create the boom egg
    const boomEgg = document.createElement("img");
    boomEgg.setAttribute("id", "egg1");
    boomEgg.setAttribute("src", "boom.gif"); // Set the source of the boom egg image
    boomEgg.style.width = halfWidth / 2 + "px";
    boomEgg.style.height = halfHeight / 2 + "px";
    container.appendChild(boomEgg);

    // Set a random position for the boom egg
    const containerRect = container.getBoundingClientRect();
    const maxLeft = containerRect.width - newEgg1.offsetWidth;
    const maxTop = containerRect.height - newEgg1.offsetHeight;
    boomEgg.style.left = Math.floor(Math.random() * maxLeft) + "px";
    boomEgg.style.top = Math.floor(Math.random() * maxTop) + "px";

    // Add an event listener to handle clicks on the boom egg
    boomEgg.addEventListener("click", function () {
      boomEgg.src = "boomed.gif";
      setTimeout(function () {
        container.removeChild(boomEgg);
      }, 300);
      setTimeout(function () {
        endGame();
      }, 1000);
    });
  }
}

function endGame() {
  timer.innerHTML = "Số chiến binh trứng bị tiêu diệt: " + eggDied;
  btnplayagain[0].style.display = "flex";
  container.style.display = "none";
  timeleft = 0;
}

function playhardlevel() {
  isPlaying = true;
  optionContainer.style.display = "none";
  countdown();
}

function playnormallevel() {
  isPlaying = true;
  optionContainer.style.display = "none";
  btnplayagain[0].style.display = "flex";
}

function countdown() {
  var timerId = setInterval(function () {
    timeleft--;
    timer.innerHTML = timeleft + " giây còn lại";
    if (timeleft <= 0) {
      clearInterval(timerId);
      timer.innerHTML = "Hết thời gian!";
      container.style.display = "none";
      timer.innerHTML = "Số chiến binh trứng bị tiêu diệt: " + eggDied;
      btnplayagain[0].style.display = "flex";
      isEndGame = true;
      container.style.display = "none";
    }
  }, 1000);
}
