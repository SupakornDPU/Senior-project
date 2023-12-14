// BTN CREATE CLASSROOM CLEAR DATA
const btnCreateClassroom = document.getElementById("btnCreateClassroom");
btnCreateClassroom.addEventListener("click", function () {
   document.getElementById("nameroom").value = "";
   document.getElementById("description").value = "";
});

// GET DATA CLASSROOM
fetch('/projectsenior/classroom', {
   method: 'GET',
   headers: {
      'Content-Type': 'application/json'
   },
})
   .then(response => response.json())
   .then(data => {
      const cardClassroom = document.getElementById('cardClassroom');
      console.log(data);
      data.forEach(each => {
         const classroomCol = document.createElement('div');
         classroomCol.className = 'col-lg-3 col-md-12 my-2';
         classroomCol.innerHTML = `
                  <div class="card shadow" id=${each._id}>
                     <div class="card-header d-flex justify-content-between align-items-center">
                     <div><h5 class="fw-bold">${each.classroom_name}<p>${each.classroom_creator}</p></h5><p style = "font-size:0.8rem;font-weight: bold">Code "${each.classroom_code}"</p></div>
                        <a id="btnupdate" href="#formedit" onclick="btnupdatedata('${each._id}')" ><i class="fa-solid fa-gear"></i></a>
                     </div>
                     <div class="card-body d-flex justify-content-between">
                        <div class="row card-text">
                           <div class="col-md-12">
                              <p class="card-text">${each.classroom_des}</p>
                           </div>
                           <div class="col-md-12 d-flex align-items-end">
                              <a href="deck?classroomID=${each._id}" class="btn btn-primary fw-bold">Go</a>
                           </div>
                        </div>
                     </div>
                  </div>
               `;
         cardClassroom.appendChild(classroomCol);
      });
   })
   .catch(err => console.log(err))

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('name')
console.log(userName);

// POST DATA Create Classroom
const formadd = document.getElementById("createroom");
formadd.addEventListener("submit", (e) => {
   e.preventDefault();

   const getNameRoom = document.getElementById("nameroom").value;
   const namerooms = getNameRoom.toUpperCase();
   // const creators = document.getElementById("creator").value;
   const descriptions = document.getElementById("description").value;
   const teacherids = document.getElementById("teacherid").value;
   const adminids = document.getElementById("adminid").value;

   fetch('/projectsenior/classroom', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "classroom_name": namerooms,
         "classroom_creator": userName,
         "classroom_des": descriptions,
         "teacher_id": teacherids,
         "admin_id": adminids,
      })
   })
      .then(response => console.log(response))
      .catch(err => {
         swal.fire({
            title: err,
            icon: "error",
            showConfirmButton: false,
            timer: 1000
         })
      })
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
            window.location.href = "classroom"
         });
      })
   document.getElementById("nameroom").value = "";
   document.getElementById("description").value = "";
})

// BTN UPDATE CLASSROOM
function btnupdatedata(id) {
   inputShowClassroomID = document.getElementById("classroomID");
   inputShowClassroomID.value = id;
   fetch('/projectsenior/classroom/' + id, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      },
   })
      .then(response => response.json())
      .then(data => {
         const namerooms = document.getElementById("updatenameroom");
         const descriptions = document.getElementById("updatedescription");
         namerooms.value = data.classroom_name;
         descriptions.value = data.classroom_des;
      })
      .catch(err => console.log(err))
}

// UPDATE DATA
const formupdate = document.getElementById("updateroom");
formupdate.addEventListener("submit", (e) => {
   e.preventDefault();
   const namerooms = document.getElementById("updatenameroom").value;
   const creators = document.getElementById("updatecreator").value;
   const descriptions = document.getElementById("updatedescription").value;
   const teacherids = document.getElementById("updateteacherid").value;
   const adminids = document.getElementById("updateadminid").value;
   const classroomID = document.getElementById("classroomID").value;

   fetch('/projectsenior/classroom/' + classroomID, {
      method: 'put',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "classroom_name": namerooms,
         "classroom_creator": creators,
         "classroom_des": descriptions,
         "teacher_id": teacherids,
         "admin_id": adminids,
      })
   })
      .then(response => console.log(response))
      .catch(err => {
         swal.fire({
            title: err,
            icon: "error",
            showConfirmButton: false,
            timer: 1000
         })
      })
      .then(() => {
         // SweetAlert
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "success",
            title: "Update successfully"
         }).then(() => {
            window.location.href = "classroom"
         });
      })
   document.getElementById("nameroom").value = "";
   document.getElementById("description").value = "";
})

// DELETE DATA
function btndeletedata() {
   const classroomID = document.getElementById("classroomID").value;
   Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
   }).then((result) => {
      if (result.isConfirmed) {
         fetch("/projectsenior/classroom/" + classroomID, {
            method: "DELETE",
         })
            .then((response) => response.json())
            .then(() => {
               Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 900,
               }).then(() => {
                  window.location.href = "classroom";
               });
            }).catch((err) => console.log(err));
      }
   });
}