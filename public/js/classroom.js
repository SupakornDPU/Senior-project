const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('name')
console.log(userName);

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
    const cardClassroom = document.getElementById('rowclasscard');
    console.log(data);
    data.forEach(each => {
      const classroomCol = document.createElement('div');
      classroomCol.className = 'col-lg-3 col-md-12 my-2';
      classroomCol.innerHTML = `
      <div class="gallery gallery--grid">
        <div class="gallery__item">
          <div class="cards" id="classcard">
            <div class="card__block card__block--main" id=${each._id}>
              <div class="card-headers d-flex justify-content-between align-items-top">
                <div><h3 class="card__title">${each.classroom_name}</h5>
                  <p class="fw-bold">${each.classroom_creator}</p>
                  <p class="card__subtitle">${each.classroom_code}</p>
                  
                </div>
                  <a id="btnupdate" href="#formedit" onclick="btnupdatedata('${each._id}')" ><i class="fa-solid fa-gear" style="color: black;"></i></a>
              </div>
                
              <p class="card__text">${each.classroom_des}</p>
            </div>
            <a href="deck?classroomID=${each._id}" class="button button--primary trade" type="button">Go</a>
            </button>
          </div>
        </div>
      </div>
      `;
      cardClassroom.appendChild(classroomCol);
    });
  })
  .catch(err => console.log(err))

// POST DATA Create Classroom
const formadd = document.getElementById("createroom");
formadd.addEventListener("submit", (e) => {
  e.preventDefault();

  const getNameRoom = document.getElementById("nameroom").value;
  const namerooms = getNameRoom.toUpperCase();
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
        window.location.href = "classroom?name=" + userName;
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
        window.location.href = "classroom?name=" + userName
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
            window.location.href = "classroom?name=" + userName;
          });
        }).catch((err) => console.log(err));
    }
  });
}