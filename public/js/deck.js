const urlParams = new URLSearchParams(window.location.search);
const classroomID = urlParams.get('classroomID')
console.log(classroomID);

// GET DATA CLASSROOM
fetch('/projectsenior/deck/' + classroomID, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
  .then(response => response.json())
  .then(data => {
    const decks = document.getElementById('innerhtmlclassflash');
    console.log(data);
    data.forEach(each => {
      const deckCol = document.createElement('div');
      deckCol.className = 'ag-courses_item';
      deckCol.innerHTML = `
              <div href="#" class="ag-courses-item_link" id=${each._id}>
                <div class="ag-courses-item_bg"></div>
                <div class="ag-courses-item_title card-header d-flex justify-content-between align-items-center">
                    ${each.deck_name} <a class="button gear-manage" id="btnupdatedeck" href="#formeditdeck" onclick="btnupdatedeck('${each._id}')" ><i class="fa-solid fa-gear"></i></a>
                </div>
                <div class="ag-courses-item_date-box">
                    <div class="row mb-2">
                      <div class="col-md-12">
                          <a class="btn btn-primary font-poppin" href="flashcard?deck=${each._id}" role="button" style="font-weight: bold;">Learning</a>
                      </div>
                    </div>
                    <div class="row mb-2 btnManageFlashcard">
                      <div class="col-md-12">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addQuiz"
                          onclick="" style="font-weight: bold;">
                            Add Quiz
                          </button></td>
                      </div>
                    </div>
                    <div class="row mb-2 btnManageFlashcard">
                      <div class="col-md-12">
                          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#manageFlashcards"
                          onclick="btn_manageFlashcard('${each._id}')" style="font-weight: bold;">
                          Manage Flashcard
                          </button></td>
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-12">
                          <a class="btn btn-primary font-poppin" href="scoreboard" role="button" style="font-weight: bold;">Score Board</a>
                      </div>
                    </div>
                </div>
              </div>
          </div>
        `;
      decks.appendChild(deckCol);
    });
  })
  .then(() => {
    fetch(`/projectsenior/index`, {})
      .then(response => response.json())
      .then(data => {
        console.log('Logged in user:', data.loggedIn);
        console.log('Role:', data.role);
        const menuClassroom = document.getElementById('sidebarClassroom');
        const btnCreateDeck = document.getElementById('btnCreateDeck');
        const btnManageFlashcard = document.querySelectorAll('.btnManageFlashcard');
        const btnUpdateDeck = document.querySelectorAll('.gear-manage');

        if (data.loggedIn) {
          if (data.role == 'Student') {
            btnCreateDeck.style.display = 'none';
            btnManageFlashcard.forEach(button => {
              button.style.display = 'none';
            });
            btnUpdateDeck.forEach(button => {
              button.style.display = 'none';
            });
            menuClassroom.href = 'classroom_student';
          } else if (data.role == 'Teacher') {
            menuClassroom.href = 'classroom';
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
  .catch(err => console.log(err))


function btncreatedeck(id) {
  const inputShowClassroomID = document.getElementById("deckID");
  inputShowClassroomID.value = id;
}

// Funtion get ข้อมูลมาแสดงในหน้า popup update
function btnupdatedeck(id) {
  const inputShowClassroomID = document.getElementById("deckID");
  inputShowClassroomID.value = id;

  fetch('/projectsenior/deck/getById/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      const namedeck = document.getElementById("updatenamedeck");
      namedeck.value = data.deck_name;
    })
    .catch(err => console.log(err))
}

// DELETE DECK
function btndeletedeck() {
  const DeckID = document.getElementById("deckID").value;
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('/projectsenior/deck/' + DeckID, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(() => {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 900,
          }).then(() => {
            document.location = "deck?classroomID=" + classroomID;
          });
        })
        .catch(err => console.log(err))
    }
  });
}

// Funtion ให้ตัวแรกเป็นตัวใหญ่
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// UPDATE DECK
const formupdatedeck = document.getElementById("updatedecks");
formupdatedeck.addEventListener("submit", (e) => {
  e.preventDefault();
  const DeckID = document.getElementById("deckID").value;
  const getNameDeck = document.getElementById("updatenamedeck").value;
  const namedeck = capitalizeFirstLetter(getNameDeck);
  const teacherids = document.getElementById("updateteacherid").value;
  const adminids = document.getElementById("updateadminid").value;

  fetch('/projectsenior/deck/' + DeckID, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "deck_name": namedeck,

    })
  })
    .then(response => console.log(response))
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
        document.location = "deck?classroomID=" + classroomID;
      });
    })
    .catch(err => {
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
        icon: "error",
        title: err
      }).then(() => {
        document.location = "deck?classroomID=" + classroomID;
      });
    })
  document.getElementById("nameroom").value = "";
  document.getElementById("description").value = "";
})

// Create Deck //
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

/////////////////// manageFlashcard //////////////////////

function btn_manageFlashcard(id) {
  inputShowClassroomID = document.getElementById("deckID");
  inputShowClassroomID.value = id;
}

// POST import excel file
const fileInput = document.getElementById('formFile');
const formImport = document.getElementById('formImport');

formImport.addEventListener('submit', (e) => {
  e.preventDefault();
  const deckId = document.getElementById("deckID").value;
  console.log(deckId);
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  fetch('/projectsenior/flashcard/import/' + deckId, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
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
        title: "Import successfully"
      }).then(() => {
        window.location.reload();
      })
    })
});

// POST import textarea
const textareaForm = document.getElementById('textareaForm');
textareaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const questions = document.querySelectorAll('textarea[name="question"]');
  const answers = document.querySelectorAll('textarea[name="answer"]');
  const deckId = document.getElementById("deckID").value;
  const data = [];

  //เช็คค่าว่าง ถ้าเป็นจริงจะรีเทิร์นกลับแล้วจบIF ถ้าเป็นเท็จจะทำการบันทึกทั้งหมด
  let CheckEmptyField = false;

  // สร้างอาเรย์ของอ็อบเจ็กต์เพื่อเก็บข้อมูลจากทุก textarea
  // ใช้ trim() เพื่อลบช่องว่างที่อาจจะมี).
  questions.forEach((question, index) => {
    if (question.value.trim() === '' || answers[index].value.trim() === '') {
      CheckEmptyField = true;
      return;
    }

    data.push({
      question: question.value,
      answer: answers[index].value,
      deckid: deckId
    });
  });
  //เมื่อ CheckEmptyField เป็นจริงจะทำการแจ้งเตือนและจบการทำงาน
  if (CheckEmptyField) {
    // แสดงการแจ้งเตือนถ้ามี textarea ว่าง
    alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    return;
  }

  // ทำ Fetch เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์ Node.js

  fetch('/projectsenior/flashcard/' + deckId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  })
    .then(response => response.json())
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
        title: "Create Flashcard successfully"
      }).then(() => {
        window.location = "deck?classroomID=" + classroomID;
      });

      // Reset textarea values
      questions.forEach(question => (question.value = ''));
      answers.forEach(answer => (answer.value = ''));
    })
    .catch(err => console.log(err));
});
