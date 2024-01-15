// Api Get Session
fetch(`/projectsenior/index`, {})
  .then(response => response.json())
  .then(data => {
    const a = document.getElementById("studentId");
    a.value = data.loggedIn
    console.log('Logged in user:', data.loggedIn);
    console.log('Role:', data.role);

    // Api Get Classroom
    // ต้องนำมาใส่ไว้ใน fetch ของ user เพราะว่าต้องการให้ทำงานหลังจากที่ user ทำงานเสร็จแล้ว
    fetch('/projectsenior/student/' + data.loggedIn, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        data.classroom.forEach(each => {
          console.log(each);
          const classroomCol = document.createElement('div');
          classroomCol.className = 'col-lg-3 col-md-12 my-2';
          classroomCol.innerHTML = `
                    <div class="card" id=${each._id}>
                      <div class="card-header d-flex justify-content-between align-items-center">
                      <div><h5 class="fw-bold">${each.classroom_name}<p>${each.classroom_creator}</p></h5></div>
                      <a id="btn_std_delete_class" onclick="btn_std_delete_class('${each._id}')" ><i class="fa-solid fa-x"></i></a>
                      </div>
                      <div class="card-body d-flex justify-content-between"> 
                          <div class="row card-text">
                            <div class="col-md-12">
                                <p class="card-text">${each.classroom_des}</p>
                            </div>
                            <div class="col-md-12 d-flex align-items-end">
                                <a href="deck.html?classroomID=${each._id}" class="btn btn-primary fw-bold">Go</a>
                            </div>
                          </div>
                      </div>
                    </div>`;
          cardClassroom.appendChild(classroomCol);
        })
      })
      .catch(err => console.log(err));
  })
  .catch((error) => {
    console.error('error:', error);
  });

// Api Put Data Classroom
// การ Fetch api เส้นนี้สามารถใช้งานได้เนื่องจากเป็นการทำงานหลังจาก ที่ API เส้นแรกทำงานเสร็จแล้ว
const joinclass = document.getElementById("joinroom");
joinclass.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = document.getElementById("studentId").value;
  const roomcodes = document.getElementById("roomcode").value;

  fetch('/projectsenior/student/' + studentId, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "classroom": roomcodes,
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message);
        });
      }
      return response.json();
    })
    .then(() => {
      alert("เพิ่มห้องเรียนเรียบร้อย")
      window.location.href = " classroom_student "
    })
    .catch(err => {
      swal.fire({
        title: err,
        icon: "error",
        showConfirmButton: false,
        timer: 1000
      })
    })
})

// DELETE DATA
function btn_std_delete_class(id) {
  const studentId = document.getElementById("studentId").value;
  const classroomId = id;
  console.log(id)
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    console.log(id)
    if (result.isConfirmed) {
      fetch("/projectsenior/student/" + studentId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classroomId: classroomId }),
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
            location.reload();
          });
        }).catch((err) => console.log(err));
    }
  });
}