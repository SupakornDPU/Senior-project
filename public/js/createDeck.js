const urlParams = new URLSearchParams(window.location.search);
const classroomID = urlParams.get('classroomID')
console.log(classroomID);

const createdeck = document.getElementById("createdeck");
createdeck.addEventListener("submit", (e) => {
   e.preventDefault();

   const deckname = document.getElementById("deckname").value;
   const teacherids = document.getElementById("teacherid").value;
   const adminids = document.getElementById("adminid").value;

   fetch('/projectsenior/deck', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "deck_name": deckname,
         "teacher_id": teacherids,
         "admin_id": adminids,
         "classroom_id": classroomID
      })
   })
      .then(response => console.log(response))
      .then(() => {
         // SweetAlert
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "success",
            title: "Create successfully"
         }).then(() => {
            window.location = "deck?classroomID=" + classroomID;
         });
      })
      .catch(err => {
         // SweetAlert
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "error",
            title: err
         }).then(() => {
            window.location = "deck?classroomID=" + classroomID;
         });
      })
   document.getElementById("deckname").value = "";
})