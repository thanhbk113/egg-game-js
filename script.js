const egg = document.getElementById("egg");
const container = document.getElementById("container");
egg.addEventListener("touchstart", function (event) {
  event.preventDefault();
  jump();
});

let position = container.offsetWidth / 2.5;
let direction = 1;
let isMovingLeft = false;
let isMovingRight = false;

function moveEgg() {
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
    console.log("🚀 ~ event:", event);
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
    setTimeout(function () {
      container.removeChild(newEgg1);
      setScore();
    }, 3000);
  });

  newEgg2.addEventListener("click", function () {
    newEgg2.style.animation = "disappear 1s forwards";
    newEgg2.style.animation = "shake 1.5s ease-in-out forwards";
    newEgg2.src = "break-egg.gif";
    setTimeout(function () {
      container.removeChild(newEgg2);
      setScore();
    }, 3000);
  });
}
