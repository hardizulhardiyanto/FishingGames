<template>
  <div>
    <div id="game-container">
      <h1 id="start-title">Loading !!</h1>
      <div id="info-wrapper">
        <div id="instructions"></div>
        <button id="start-btn"><span class="arrow"></span></button>
      </div>
      <div id="game-stats">
        <span id="game-day"></span>

        <div id="clock">
          <svg
            viewBox="0 0 120 120"
            class="chart-gauge"
            fill="none"
            stroke-width="4"
          >
            <circle class="timer-backdrop" r="40" cx="60" cy="60"></circle>
            <circle class="timer-gauge" r="40" cx="60" cy="60"></circle>
            <text y="50%" x="50%" id="game-timer" class="timer-time">50s</text>
          </svg>
        </div>
        <!-- <span id="game-score">Total Score: 0</span> -->
        <span id="game-score"></span>
      </div>
      <p id="game-goal"></p>
      <div id="game__point">
        {{ "Goal : " + state.percentageGetFish + "%" + " to 100%" }}
      </div>
      <div id="fishbait_count">
        <p>{{ "Umpan Ikan Merah : " + state.fishBaitCount.red }}</p>
        <p>{{ "Umpan Ikan Biru : " + state.fishBaitCount.blue }}</p>
        <p>{{ "Umpan Ikan Hijau : " + state.fishBaitCount.green }}</p>
      </div>
      <div id="fishavailable_count">
        <p>{{ "Sisa Ikan Merah : " + state.fishAvailableCount.red }}</p>
        <p>{{ "Sisa Ikan Biru : " + state.fishAvailableCount.blue }}</p>
        <p>{{ "Sisa Ikan Hijau : " + state.fishAvailableCount.green }}</p>
      </div>
    </div>
    <div id="click-container">
      <span id="line"></span>
    </div>
    <div id="bubbles"></div>
    <Dialog
      :formTitle="dialog.formTitle"
      :dialog="dialog.show"
      :useAction="true"
    >
      <template v-slot:formItem>
        <p>{{ dialog.text }}</p>
      </template>
      <template v-slot:action>
        <v-btn color="orange" variant="tonal" @click="backDashboard()"
          >BACK TO DASHBOARD</v-btn
        >
      </template>
    </Dialog>
  </div>
</template>

<script setup>
//@todo start
import Dialog from "@/components/Dialog.vue";
import { countPercentage } from "@/store/helpersLogic";
import { watch } from "vue";
import { computed, onMounted, reactive } from "vue";
import sound_bgm from "./sfx/Bug_Catching.mp3";
import sound_blop from "./sfx/fish.mp3";
import sound_rareBlop from "./sfx/rare-fish.mp3";
import sound_trashSound from "./sfx/trash.mp3";
import sound_bzzt from "./sfx/bzzt.mp3";
import sound_bite from "./sfx/bite.mp3";
import { useRouter } from "vue-router";
import router from "@/router";

const props = defineProps({
  loadPlayGames: {
    type: Object,
    default: () => {},
  },
});

const state = reactive({
  fishBait: [],
  fishLoad: [],
  // equipment: "",
  equipmentList: [],
  fishBaitCount: {},
  fishAvailableCount: {
    red: 0,
    blue: 0,
    green: 0,
  },
  fishRedAdd: {
    count: 0,
    percentage: 0,
  },
  fishBlueAdd: {
    count: 0,
    percentage: 0,
  },
  fishGreenAdd: {
    count: 0,
    percentage: 0,
  },
  percentageGetFish: 0,
});

const dialog = reactive({
  show: false,
  formTitle: "",
  text: "",
});

const backDashboard = () => {
  router.push({ name: "Dashboard" });
  setTimeout(function () {
    window.location.reload();
  }, 1000);
};

watch(props, (value) => {
  let { fishLoad, playerStart } = JSON.parse(
    JSON.stringify(props.loadPlayGames)
  );
  // state.fishBait = playerStart.fishBait;
  state.fishBaitCount = playerStart.fishBaitCount;
  state.fishLoad = fishLoad;
  state.equipmentList = playerStart.equipmentList;

  updateFishAvailableCount();
});

watch(state, (val) => {
  if (state.percentageGetFish === 100) {
    dialog.formTitle = "WINNER";
    dialog.text = "Selamat Anda Memenangkan Permainan Score: "+state.percentageGetFish+"%";
    dialog.show = true;
  }
});

const updateFishBaitCount = (fish) => {
  switch (fish) {
    case "red":
      state.fishBaitCount.red = state.fishBaitCount.red - 1;
      break;
    case "blue":
      state.fishBaitCount.blue = state.fishBaitCount.blue - 1;
      break;
    case "green":
      state.fishBaitCount.green = state.fishBaitCount.green - 1;
      break;
  }
};

const updateFishAvailableCount = () => {
  let getRedFish = state.fishLoad.find((el) => el.fishColor === "red");
  let getBlueFish = state.fishLoad.find((el) => el.fishColor === "blue");
  let getGreenFish = state.fishLoad.find((el) => el.fishColor === "green");

  state.fishAvailableCount.red = getRedFish.countToday;
  state.fishAvailableCount.blue = getBlueFish.countToday;
  state.fishAvailableCount.green = getGreenFish.countToday;
};

// @todo count fish
const fishCounting = (fish) => {
  switch (fish) {
    case "red":
      if (state.fishAvailableCount.red - 1 >= 0) {
        state.fishAvailableCount.red = state.fishAvailableCount.red - 1;
        state.fishRedAdd.count = state.fishRedAdd.count += 1;
        //Counting Percentage
        let getRedFish = state.fishLoad.find((el) => el.fishColor === "red");
        let getPercentage = countPercentage(
          state.fishRedAdd.count,
          getRedFish.countToday,
          getRedFish.percentage
        );
        state.fishRedAdd.percentage = getPercentage;
        if (getPercentage == getRedFish.percentage) {
          state.percentageGetFish =
            state.percentageGetFish + state.fishRedAdd.percentage;
        }
      }

      break;
    case "blue":
      if (state.fishAvailableCount.blue - 1 >= 0) {
        state.fishAvailableCount.blue = state.fishAvailableCount.blue - 1;
        state.fishBlueAdd.count = state.fishBlueAdd.count += 1;

        //Counting Percentage
        let getBlueFish = state.fishLoad.find((el) => el.fishColor === "blue");
        let getPercentage = countPercentage(
          state.fishBlueAdd.count,
          getBlueFish.countToday,
          getBlueFish.percentage
        );
        state.fishBlueAdd.percentage = getPercentage;
        if (getPercentage == getBlueFish.percentage) {
          state.percentageGetFish =
            state.percentageGetFish + state.fishBlueAdd.percentage;
        }
      }
      break;
    case "green":
      if (state.fishAvailableCount.green - 1 >= 0) {
        state.fishAvailableCount.green = state.fishAvailableCount.green - 1;
        state.fishGreenAdd.count = state.fishGreenAdd.count += 1;
        //Counting Percentage
        let getGreenFish = state.fishLoad.find(
          (el) => el.fishColor === "green"
        );
        let getPercentage = countPercentage(
          state.fishGreenAdd.count,
          getGreenFish.countToday,
          getGreenFish.percentage
        );
        state.fishGreenAdd.percentage = getPercentage;
        if (getPercentage == getGreenFish.percentage) {
          state.percentageGetFish =
            state.percentageGetFish + state.fishGreenAdd.percentage;
        }
      }
      break;
  }
};


onMounted(() => {
  const gameContainer = document.querySelector("#game-container");
  const clickContainer = document.querySelector("#click-container");
  const fishingLine = document.querySelector("#line");
  const startScreen = document.querySelector("#start-screen");
  const startTitle = document.querySelector("#start-title");
  const infoWrapper = document.querySelector("#info-wrapper");
  const instructions = document.querySelector("#instructions");
  const startBtn = document.querySelector("#start-btn");
  const gameStats = document.querySelector("#game-stats");
  const gameGoal = document.querySelector("#game-goal");
  const gamePoint = document.querySelector("#game__point");
  const fishBaitCount = document.querySelector("#fishbait_count");
  const fishAvailableCount = document.querySelector("#fishavailable_count");
  const gameDay = document.querySelector("#game-day");
  const gameTimer = document.querySelector("#game-timer");
  const gameTimerGauge = document.querySelector(".timer-gauge");
  const gameScore = document.querySelector("#game-score");
  var mousePosition = {
    x: 0,
    y: 0,
  };
  var gameTimerInterval = null;
  var day = 0;
  var score = 0;
  var currentScore = 0;
  var fishTracker = [0, 0, 0, 0]; //first item is fish, second is rare fish, third is trash, fourth is jellyfish. no sharks as it will lead to autolose

  //initialise the create items interval variables
  var createFishInterval = null;
  var createRareFishInterval = null;
  var createTrashInterval = null;
  var createJellyfishInterval = null;
  var createSharkInterval = null;


  //music and sounds
  var bgm; //set bgm
  var blop; //fish sound
  var rareBlop; // rare fish sound
  var trashSound; // trash sound
  var bzzt; //jellyfish zapping sound
  var bite; //shark bite sound
  var sec;

  //event listeners
  startBtn.addEventListener("click", startGame);
  clickContainer.addEventListener("mousemove", checkCursor);

  function checkCursor(event) {
    //update cursor co ordinates
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    //set fishing line to follow cursor
    fishingLine.style.left = mousePosition.x + "px";
    fishingLine.style.top = mousePosition.y + "px";
  }
  //create audio element for playing music and sfx
  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    };
    this.stop = function () {
      this.sound.pause();
    };
  }
  startGame() 
  //@todo start game function
  function startGame() {
    day = 4; //di set to 4
    //initialise sounds
    blop = new Audio(sound_blop);
    rareBlop = new Audio(sound_rareBlop);
    trashSound = new Audio(sound_trashSound);
    bzzt = new Audio(sound_bzzt);
    bite = new Audio(sound_bite);
    bgm = new Audio(sound_bgm);
    bgm.play();
    if (day === 0) {
      fishTracker = [0, 0, 0, 0, 0];
      score = 0;
    }
    currentScore = 0;
    infoWrapper.style.display = "none";
    startTitle.style.display = "none";
    clickContainer.style.display = "block";
    gameStats.style.display = "flex";
    gameGoal.style.display = "block";
    gamePoint.style.display = "block";
    fishBaitCount.style.display = "block";
    fishAvailableCount.style.display = "block";

    createItems();
  }

  // startGame(); //Setelah development diaktifkan lg, untuk auto start
  //create items function
  function createItems() {
    createTimer();
    day++;
    // gameDay.innerText = "Day 0" + day;
    // gameGoal.innerText = `Goal: ${currentScore}/${days[day - 1].score}`;

    createFishInterval = setInterval(createFish, 250);
    createRareFishInterval = setInterval(createRareFish, 1250);
    createSharkInterval = setInterval(createShark, 4000);
  }

  //create timer function
  function createTimer() {
    gameTimer.innerText = "15s";
    gameScore.innerText = "Total Score: 0";
    let sec = 0;
    gameTimerInterval = setInterval(startGameTimer, 1000);
    // gameTimerInterval = 9;

    function startGameTimer() {
      if (state.percentageGetFish == 100) {
        endDay(true);
      }
      gameTimer.textContent = 50 - sec + "s";
      if (sec === 50) {
        sec = 0;
        endDay(false);
        gameTimer.textContent = 50 - sec + "s";
        gameTimer.classList.remove("warning");
        gameTimerGauge.classList.remove("ticking");
      } else {
        if (sec === 1) {
          gameTimerGauge.classList.add("ticking");
        }
        if (sec > 9) {
          gameTimer.classList.add("warning");
        }
        sec++;
      }
    }
  }
  //create fish function
  function createFish() {
    let fish = document.createElement("div");
    fish.classList.add("item");
    fish.classList.add("fish");
    clickContainer.appendChild(fish);
    setPosition(fish);
    fish.addEventListener("mouseover", hit);
    setTimeout(function () {
      if (!fish.classList.contains("caught")) {
        fish.classList.add("disappear");
      }
      setTimeout(function () {
        if (clickContainer.contains(fish)) {
          clickContainer.removeChild(fish);
        }
      }, 350);
    }, 1000);
  }
  //create rare fish function
  function createRareFish() {
    let fish = document.createElement("div");
    fish.classList.add("item");
    fish.classList.add("rare-fish");
    clickContainer.appendChild(fish);
    setPosition(fish);
    fish.addEventListener("mouseover", hit);
    setTimeout(function () {
      if (!fish.classList.contains("caught")) {
        fish.classList.add("disappear");
      }
      setTimeout(function () {
        if (clickContainer.contains(fish)) {
          clickContainer.removeChild(fish);
        }
      }, 350);
    }, 650);
  }

  //create shark function
  function createShark() {
    let shark = document.createElement("div");
    shark.classList.add("item");
    shark.classList.add("shark");
    clickContainer.appendChild(shark);
    setPosition(shark);
    shark.addEventListener("mouseover", hit);
    setTimeout(function () {
      if (!shark.classList.contains("caught")) {
        shark.classList.add("disappear");
      }
      setTimeout(function () {
        if (clickContainer.contains(shark)) {
          clickContainer.removeChild(shark);
        }
      }, 350);
    }, 3000);
  }

  function setPosition(item) {
    let leftPos = Math.floor(
      Math.random() * (clickContainer.offsetWidth - 100)
    );
    let topPos = Math.floor(
      Math.random() * ((clickContainer.offsetHeight / 5) * 4 - 100) +
        clickContainer.offsetHeight / 5
    );
    // if it a type of sea creature and is not trash
    if (!item.classList.contains("trash")) {
      let randomNum = Math.floor(Math.random() * 2);
      //left side
      if (randomNum % 2 === 0) {
        if (!item.classList.contains("jellyfish")) {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 4 - 100)
          );
        } else {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 2 - 100)
          );
        }
        setInterval(function () {
          if (item.classList.contains("fish")) {
            leftPos += 45;
          } else if (item.classList.contains("rare-fish")) {
            leftPos += 65;
          } else if (item.classList.contains("jellyfish")) {
            leftPos += 5;
          } else if (item.classList.contains("shark")) {
            leftPos += 15;
            if (topPos > mousePosition.y) {
              topPos -= 10;
            } else {
              topPos += 10;
            }
          }
          item.style.left = leftPos + "px";
          item.style.top = topPos + "px";
        }, 100);
        item.classList.add("left");
      }
      //right side
      else {
        if (!item.classList.contains("jellyfish")) {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 4 - 100) +
              (clickContainer.offsetWidth / 4) * 3
          );
        } else {
          leftPos = Math.floor(
            Math.random() * (clickContainer.offsetWidth / 2 - 100) +
              clickContainer.offsetWidth / 2
          );
        }
        setInterval(function () {
          if (item.classList.contains("fish")) {
            leftPos -= 45;
          } else if (item.classList.contains("rare-fish")) {
            leftPos -= 65;
          } else if (item.classList.contains("jellyfish")) {
            leftPos -= 5;
          } else if (item.classList.contains("shark")) {
            leftPos -= 15;
            if (topPos > mousePosition.y) {
              topPos -= 10;
            } else {
              topPos += 10;
            }
          }
          item.style.left = leftPos + "px";
          item.style.top = topPos + "px";
        }, 100);
        item.classList.add("right");
      }
      item.style.left = leftPos + "px";
      item.style.top = topPos + "px";
    }
    //if it is trash
    else {
      item.style.left = leftPos + "px";
      item.style.top = topPos + "px";
    }
  }
  function hit(event) {
    //@todo HIT IKAN
    if (!fishingLine.classList.contains("zapped")) {
      let type = event.target.classList;
      let hitText = document.createElement("span");
      hitText.setAttribute("class", "hit-text");
      this.parentNode.insertBefore(hitText, this);
      hitText.style.left = this.style.left;
      hitText.style.top = this.style.top;
      if (!this.classList.contains("caught")) {
        this.classList.add("caught");
        //@todo RED FISH AREA
        if (type.contains("fish")) {
          //Check FISH
          if (state.fishAvailableCount.red == 0) {
            return;
          }
          // Bukan Pancingannya
          let getEquipment = state.equipmentList.find(
            (el) => el.name === "small"
          );
          if (!getEquipment) {
            hitText.innerText = "Fish not SMALL";
            hitText.style.color = "#ffffff";
            trashSound.play();
            return;
          }

          // Bukan Umpan nya
          if (state.fishBaitCount.red == 0) {
            hitText.innerText = "Tidak ada Umpan MERAH";
            hitText.style.color = "#ffffff";
            trashSound.play();
            return;
          }

          //Melakukan update umpan ikan
          updateFishBaitCount("red");

          //Melakukan hitung ikan
          fishCounting("red");

          hitText.innerText = "+1";
          hitText.style.color = "#00ffcd";
          blop.play();
          score++;
          currentScore++;
          fishTracker[0]++;
        } else if (type.contains("rare-fish")) {
          //@todo BLUE FISH AREA
          if (state.fishAvailableCount.blue == 0) {
            return;
          }
          // Bukan Pancingannya
          let getEquipment = state.equipmentList.find(
            (el) => el.name === "medium"
          );
          if (!getEquipment) {
            hitText.innerText = "Fish not MEDIUM";
            hitText.style.color = "#ffffff";
            trashSound.play();
            return;
          }

          // Bukan Umpan nya
          if (state.fishBaitCount.blue == 0) {
            hitText.innerText = "Tidak ada umpan BIRU";
            hitText.style.color = "#ffffff";
            trashSound.play();
            return;
          }

          //Melakukan update umpan ikan
          updateFishBaitCount("blue");

          //Melakukan hitung ikan
          fishCounting("blue");

          hitText.innerText = "+5";
          hitText.style.color = "#9766d3";
          rareBlop.play();
          score += 5;
          currentScore += 5;
          fishTracker[1]++;
        } else if (type.contains("shark")) {
          //@todo GREEN FISH AREA
          if (state.fishAvailableCount.green == 0) {
            return;
          }
          //Bukan Pancingannya
          let getEquipment = state.equipmentList.find(
            (el) => el.name === "large"
          );
          if (!getEquipment) {
            hitText.innerText = "Fish not LARGE";
            hitText.style.color = "#ffffff";
            trashSound.play();
            return;
          }
          // Bukan Umpan nya
          if (state.fishBaitCount.green == 0) {
            hitText.innerText = "Tidak ada umpan HIJAU";
            hitText.style.color = "#ffffff";
            trashSound.play();
            return;
          }

          //Melakukan update umpan ikan
          updateFishBaitCount("green");

          //Melakukan hitung ikan
          fishCounting("green");

          hitText.innerText = "+5";
          hitText.style.color = "#9766d3";
          rareBlop.play();
          score += 5;
          currentScore += 5;
          fishTracker[1]++;
        } else if (type.contains("trash")) {
          hitText.innerText = "-3";
          hitText.style.color = "#ff5252";
          trashSound.play();
          score -= 3;
          currentScore - 3;
          fishTracker[2]++;
        } else if (type.contains("jellyfish")) {
          fishingLine.classList.add("zapped");
          clickContainer.classList.add("zapped");
          hitText.innerText = "zap!";
          bzzt.play();
          hitText.style.color = "#ffff33";
          fishTracker[2]++;
          setTimeout(function () {
            fishingLine.classList.remove("zapped");
            clickContainer.classList.remove("zapped");
          }, 2000);
        }
        // else if (type.contains("shark")) {
        //   bite.play();
        //   endDay(true);
        //   sec = 0;
        // }

        setTimeout(function () {
          clickContainer.removeChild(hitText);
        }, 1000);
        // gameScore.innerText = `Total Score: ${score}`;
        // gameGoal.innerText = `Goal: ${currentScore}/${days[day - 1].score}`;
      }
    }
  }
  function endDay(died) {
    bgm.pause();
    clearInterval(gameTimerInterval);
    clearInterval(createFishInterval);
    clearInterval(createRareFishInterval);
    clearInterval(createTrashInterval);
    clearInterval(createJellyfishInterval);
    clearInterval(createSharkInterval);
    let remainingItems = document.querySelectorAll(".item");
    for (var i = 0; i < remainingItems.length; i++) {
      clickContainer.removeChild(remainingItems[i]);
    }
    gameStats.style.display = "none";
    clickContainer.style.display = "none";
    gameGoal.style.display = "none";
    gamePoint.style.display = "none";
    fishBaitCount.style.display = "none";
    fishAvailableCount.style.display = "none";

    startBtn.style.top = "66%";
    if (!died) {
      dialog.formTitle = "Kamu Kalah, mereka sangat cepat!"
      dialog.text = "Score Terakhir: "+ state.percentageGetFish+"%"
      dialog.show = true;
    } else {
      day = 0;
      instructions.innerHTML = `<h2>Permainan Berakhir!</h2><p>Umpan Anda Telah Habis<br>Silahkan beli umpan lagi!</p>`;
    }
  }
  //Make bubbles
  var bubbles = document.getElementById("bubbles");
  var randomN = function (start, end) {
    return Math.random() * end + start;
  };
  var bubbleNumber = 0,
    generateBubble = function () {
      if (bubbleNumber < 20) {
        var bubble = document.createElement("div");
        var size = randomN(5, 10);
        bubble.setAttribute(
          "style",
          "width: " +
            size +
            "px; height: " +
            size +
            "px; left:" +
            randomN(1, bubbles.offsetWidth - (size + 4)) +
            "px;"
        );
        bubbles.appendChild(bubble);
        bubbleNumber++;
      } else {
        clearInterval(bubbleInterval);
      }
    };
  generateBubble();
  var bubbleInterval = setInterval(generateBubble, 500);

  // instructions.innerHTML = `<p>${days[day].instruction}</p>`;
});
</script>

<style lang="css">
@import "./css/style.css";
</style>
