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
         alert("เพิ่มเรียบร้อย")
         console.log(classroomID)

         // อัพเดทข้อมูลเข้าไปใน Array ของ deck ที่อยู่ใน Collection classroom
         fetch('/projectsenior/deck/' + classroomID, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json'
            },
         })
            .then(response => console.log(response))
            .catch(err => console.log(err))
         window.location = "deck.html?classroomID=" + classroomID;
      })
      .catch(err => console.log(err))
   document.getElementById("deckname").value = "";
})