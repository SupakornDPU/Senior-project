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
          const classroomCard = document.getElementById('classroomCard');
          const classroomCol = document.createElement('div');
          classroomCol.className = 'col-lg-3 col-md-12 my-2 cardItem';
          classroomCol.innerHTML = `
            <div class="gallery gallery--grid">
            <div class="gallery__item">
              <div class="cards">
                <div class="card__block card__block--main" id=${each._id}>
                  <div class="card-headers d-flex justify-content-between align-items-top">
                    <div><h3 class="card__title">${each.classroom_name}</h5>
                      <p class="fw-bold">${each.classroom_creator}</p>
                      <p class="card__subtitle">Code: ${each.classroom_code}</p>
                    </div>
                    <a id="btn_std_delete_class" href="#" onclick="btn_std_delete_class('${each._id}')" ><i class="fa-solid fa-x"></i></a>
                  </div>
                  <hr>
                  <p class="card__text">${each.classroom_des}</p>
                </div>
                <a href="deck?classroomID=${each._id}" class="button button--primary trade" type="button">Go</a>
                </button>
              </div>
            </div>
          </div>
            `;
          classroomCard.appendChild(classroomCol);
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
        title: "Add classroom successfully"
      }).then(() => {
        window.location.href = "classroom_student";
      });
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
            window.location.reload();
          });
        }).catch((err) => console.log(err));
    }
  });
}