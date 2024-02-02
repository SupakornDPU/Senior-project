let sidebar = document.querySelector(".menu-sidebar");
let closeBtn = document.querySelector("#btn");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function(optional)
});

// following are the code to change sidebar button(optional)
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
    
  }
}

window.addEventListener('resize', function() {
  var width = window.innerWidth;

  if (width <= 1025) {
    // ถ้าความกว้างของหน้าจอน้อยกว่าหรือเท่ากับ 420px, ลบ class 'open'
    document.querySelector('.menu-sidebar').classList.remove('open');
  } else {
    // ถ้าความกว้างของหน้าจอมากกว่า 420px, เพิ่ม class 'open'
    document.querySelector('.menu-sidebar').classList.add('open');
  }
});

// ทำการตรวจสอบความกว้างของหน้าจอเมื่อหน้าเว็บโหลดเสร็จ
window.dispatchEvent(new Event('resize'));