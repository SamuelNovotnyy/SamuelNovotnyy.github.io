const sidebarBg = document.getElementById("sidebar-bg");
const sidebarText = document.querySelectorAll("[id='menu-text']");

function toggleDarkMode() {
          document.documentElement.classList.toggle("dark-mode");
}

function menuEffect() {
          document.getElementById("menu-ico").style.transform = "rotate(90deg)";

}  
function menuEffectOff() {
          document.getElementById("menu-ico").style.transform = "rotate(0deg)";

}         

function openSidebar() {
          document.getElementById("sidebar-bg").style.width = "200px";
          document.getElementById("sidebar-bg").style.padding = "calc(var(--topnav-h) + 60px + 20px) 40px";
          document.getElementsByClassName("fa-solid fa-bars")[0].style.transform = "scale(0) rotate(90deg)";
          document.getElementsByClassName("fa-solid fa-bars")[0].style.opacity = "0";
          document.getElementsByClassName("fa-solid fa-xmark")[0].style.transform = "scale(1)";
          document.getElementsByClassName("fa-solid fa-xmark")[0].style.opacity = "1";

          for (let i = 0; i < document.querySelectorAll("[id='menu-text']").length; i++) {
                    document.querySelectorAll("[id='menu-text']")[i].style.color = "var(--light-box-col)";
          }
}
function closeSidebar() {
          document.getElementById("sidebar-bg").style.width = "0";
          document.getElementById("sidebar-bg").style.padding = "calc(var(--topnav-h) + 60px + 20px) 0px";
          document.getElementsByClassName("fa-solid fa-bars")[0].style.transform = "scale(1) rotate(90deg)";
          document.getElementsByClassName("fa-solid fa-bars")[0].style.opacity = "1"
          document.getElementsByClassName("fa-solid fa-xmark")[0].style.transform = "scale(0)";
          document.getElementsByClassName("fa-solid fa-xmark")[0].style.opacity = "0";

          for (let i = 0; i < document.querySelectorAll("[id='menu-text']").length; i++) {
                    document.querySelectorAll("[id='menu-text']")[i].style.color = "transparent";
          }
}