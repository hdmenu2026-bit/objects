const startScreen = document.getElementById("start");
const video = document.getElementById("camera");
const viewer = document.getElementById("viewer");
const loader = document.getElementById("loader");

const models = [
  "/models/Chicken_Strips.glb",
  "/models/Cookie.glb",
  "/models/CupCake.glb",
  "/models/sushi.glb"
];

let index = 0;

/* ---------- PRELOAD ---------- */
const preloadCache = new Set();

function preloadModel(url) {
  if (preloadCache.has(url)) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "fetch";
  link.href = url;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);

  preloadCache.add(url);
}

function preloadNextModels(i) {
  for (let x = 1; x <= 2; x++) {
    preloadModel(models[(i + x) % models.length]);
  }
}

// preload only first 2 on start screen
preloadModel(models[0]);
preloadModel(models[1]);

/* ---------- MODEL SWITCH ---------- */
function showModel(i) {
  loader.style.display = "flex";
  viewer.classList.add("fade-out");

  setTimeout(() => {
    viewer.src = models[i];
    preloadNextModels(i);
  }, 300);
}

viewer.addEventListener("load", () => {
  loader.style.display = "none";
  requestAnimationFrame(() => viewer.classList.remove("fade-out"));
});

/* ---------- NAVIGATION ---------- */
document.getElementById("next").onclick = () => {
  index = (index + 1) % models.length;
  showModel(index);
};

document.getElementById("prev").onclick = () => {
  index = (index - 1 + models.length) % models.length;
  showModel(index);
};

/* ---------- START ---------- */
startScreen.onclick = async () => {
  startScreen.style.display = "none";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    video.srcObject = stream;
  } catch {
    alert("Camera access is required");
  }

  showModel(index);
};

/* ---------- AR ---------- */
document.getElementById("arBtn").onclick = () => {
  viewer.activateAR();
};