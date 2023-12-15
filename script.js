/** @format */

/**constants and variables */

const root = document.querySelector(":root");
const gCS = window.getComputedStyle(root, null);
const logIMG = document.getElementById("logIMG");

const gm = document.getElementById("gm");
const tel = document.getElementById("tel");
const cgm = document.getElementById("cgm");
const ctel = document.getElementById("ctel");
const gmPOP = document.getElementById("gmP");
const telPOP = document.getElementById("telP");

const listLen1 = [
  document.getElementById("d"),
  document.getElementById("a"),
  document.getElementById("b"),
  document.getElementById("c"),
];
const listLen2 = [
  document.getElementById("a1"),
  document.getElementById("b1"),
  document.getElementById("c1"),
  document.getElementById("d1"),
];
const cListLen2 = [
  document.getElementById("a2"),
  document.getElementById("b2"),
  document.getElementById("c2"),
  document.getElementById("d2"),
];
let listBg = [
  gCS.getPropertyValue("--A0-col"),
  gCS.getPropertyValue("--A1-col"),
  gCS.getPropertyValue("--A2-col"),
  gCS.getPropertyValue("--A3-col"),
];

let textCol = gCS.getPropertyValue("--ArrowT-col");
let cTextCol = gCS.getPropertyValue("--Text-color");
let topNavCol = gCS.getPropertyValue("--Topnav-color");
let shd = gCS.getPropertyValue("--Arrow-shadow");
let Tshd = gCS.getPropertyValue("--ArrT-shadow");
const NoShd = "drop-shadow(3px 2px 0px rgba(0,0,0,0))";

/**functions */

function setPropsMouseover(i) {
  for (let n = 0; n < i + 1; n++) {
    try {
      listLen2[n].style.backgroundColor = topNavCol;
      listLen2[n].style.color = cTextCol;
      listLen2[n].style.width = "103%";
      listLen1[n].style.setProperty("-webkit-filter", NoShd);
    } catch (e) {}
    try {
      cListLen2[n].style.width = "103%";
    } catch (e) {}
  }
}
function setPropsMouseout(i) {
  for (let n = 0; n < i + 1; n++) {
    try {
      listLen2[n].style.backgroundColor = listBg[n];
      listLen2[n].style.color = textCol;
      listLen2[n].style.width = "100%";
      listLen1[n].style.setProperty(
        "-webkit-filter",
        "drop-shadow(" + shd + ")"
      );
    } catch (e) {}
    try {
      cListLen2[n].style.width = "100%";
    } catch (e) {}
  }
}
function setPropsCotrMouseover(i) {
  for (let n = 3; n > i; n--) {
    try {
      cListLen2[n].style.backgroundColor = listBg[n];
      cListLen2[n].style.color = textCol;
      listLen1[n].style.setProperty(
        "-webkit-filter",
        "drop-shadow(" + shd + ")"
      );
      for (let m = 0; m < i + 1; m++) {
        cListLen2[m].style.width = "103%";
      }
    } catch (e) {}
  }
}
function setPropsCotrMouseout(i) {
  for (let n = 3; n > i; n--) {
    try {
      cListLen2[n].style.backgroundColor = topNavCol;
      cListLen2[n].style.color = cTextCol;
      listLen1[n].style.setProperty("-webkit-filter", NoShd);
      for (let m = 0; m < i + 1; m++) {
        cListLen2[m].style.width = "100%";
      }
    } catch (e) {}
  }
}

function resetCols() {
  textCol = gCS.getPropertyValue("--ArrowT-col");
  cTextCol = gCS.getPropertyValue("--Text-color");
  topNavCol = gCS.getPropertyValue("--Topnav-color");
  shd = gCS.getPropertyValue("--Arrow-shadow");
  Tshd = gCS.getPropertyValue("--ArrT-shadow");

  listBg = [
    gCS.getPropertyValue("--A0-col"),
    gCS.getPropertyValue("--A1-col"),
    gCS.getPropertyValue("--A2-col"),
    gCS.getPropertyValue("--A3-col"),
  ];

  for (let n = 0; n < listLen2.length + 1; n++) {
    try {
      listLen2[n].style.backgroundColor = listBg[n];
      listLen2[n].style.color = textCol;
      listLen2[n].style.width = "100%";
      listLen1[n].style.setProperty(
        "-webkit-filter",
        "drop-shadow(" + shd + ")"
      );
    } catch (e) {}
  }
  for (let n = 0; n < cListLen2.length + 1; n++) {
    try {
      cListLen2[n].style.backgroundColor = topNavCol;
      cListLen2[n].style.color = cTextCol;
      cListLen2[n].style.width = "100%";
    } catch (e) {}
  }

  if (localStorage.getItem("darkMode") == true) {
    document.documentElement.classList.toggle("dark");
  } else {
    document.documentElement.classList.toggle("light");
  }
}

function toggleDM(init) {
  var pageStyle = localStorage.getItem("pageMode");

  if (!init) {
    if (pageStyle == "dark") {
      pageStyle = "light";
    } else {
      pageStyle = "dark";
    }
  }

  document.documentElement.classList.remove("dark");
  if (window.location.pathname.split("/").slice(-1) == "index.html") {
    logIMG.setAttribute("src", "images/flowers/red.jpg");
  } else {
    logIMG.setAttribute("src", "../images/flowers/red.jpg");
  }

  if (pageStyle == "dark") {
    if (window.location.pathname.split("/").slice(-1) == "index.html") {
      logIMG.setAttribute("src", "images/flowers/blu1.jpg");
    } else {
      logIMG.setAttribute("src", "../images/flowers/blu1.jpg");
    }
    document.documentElement.classList.add("dark");
  }

  localStorage.setItem("pageMode", pageStyle);
  resetCols();
}

/**localStorage set items */

window.onload = toggleDM(true);

/**loops and functionality */

for (let i = 0; i < listLen2.length; i++) {
  (function () {
    try {
      listLen2[i].addEventListener("mouseover", function () {
        setPropsMouseover(i);
      });
    } catch (e) {}
    try {
      cListLen2[i].addEventListener("mouseover", function () {
        setPropsCotrMouseover(i);
      });
    } catch (e) {}
  })();
  (function () {
    try {
      listLen2[i].addEventListener("mouseout", function () {
        setPropsMouseout(i);
      });
    } catch (e) {}
    try {
      cListLen2[i].addEventListener("mouseout", function () {
        setPropsCotrMouseout(i);
      });
    } catch (e) {}
  })();
}

gm.onclick = function () {
  document.execCommand("copy");
};

gm.addEventListener("copy", function (event) {
  event.preventDefault();
  if (event.clipboardData) {
    event.clipboardData.setData("text/plain", cgm.textContent);
    console.log(event.clipboardData.getData("text"));

    gmPOP.classList.add("anim");
    setTimeout(() => {
      gmPOP.classList.remove("anim");
    }, 2000);
  }
});

tel.onclick = function () {
  document.execCommand("copy");
};

tel.addEventListener("copy", function (event) {
  event.preventDefault();
  if (event.clipboardData) {
    event.clipboardData.setData("text/plain", ctel.textContent);
    console.log(event.clipboardData.getData("text"));

    telPOP.classList.add("anim");
    setTimeout(() => {
      telPOP.classList.remove("anim");
    }, 2000);
  }
});
