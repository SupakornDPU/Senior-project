const urlParams = new URLSearchParams(window.location.search);
const deckId = urlParams.get('deck')
console.log(deckId);

// ! Manage Flashcard
function btn_manageFlashcard(id) {
   // inputShowClassroomID = document.getElementById("deckID");
   // inputShowClassroomID.value = id;
}

// POST import excel file
const fileInput = document.getElementById('formFile');
const formImport = document.getElementById('formImport');

formImport.addEventListener('submit', (e) => {
   e.preventDefault();
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
            window.location.reload();
         });

         // Reset textarea values
         questions.forEach(question => (question.value = ''));
         answers.forEach(answer => (answer.value = ''));
      })
      .catch(err => console.log(err));
});

// Get flashcard to show in table
fetch('/api/deck/flashcard/' + deckId, {
   method: 'GET',
   headers: {
      'Content-Type': 'application/json'
   },
})
   .then(response => response.json())
   .then(data => {
      // console.log(data);
      let html = '';
      data.forEach((item, index) => {
         // console.log(item);
         html += `
            <tr id="flashcardRow_${item._id}">
               <td>${index + 1}</td>
               <td>${item._id}</td>
               <td class="questionColumn">${item.card_question}</td>
               <td class="answerColumn">${item.card_answer}</td>
               <td>${item.deck_id}</td>
               <td>
                     <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editFlashcard"
                     onclick="getDetailEditFlashcard('${item._id}')">
                        Edit
                     </button>
               </td>
               <td>
                     <button type="button" class="btn btn-danger" onclick="deleteFlashcard('${item._id}')">
                        Delete
                     </button>
               </td>
            </tr>
         `;
      })
      document.getElementById('flashcardTableBody').innerHTML = html;
      $(document).ready(function () {
         $('#dataTable').DataTable();
      });
   })

// Get detail flashcard to edit
function getDetailEditFlashcard(flashcardId) {
   fetch('/api/deck/flashcard/getById/' + flashcardId, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      },
   })
      .then(response => response.json())
      .then(data => {
         document.getElementById('inputFlashcardId').value = data._id;
         document.getElementById('modalQuestion').value = data.card_question;
         document.getElementById('modalAnswer').value = data.card_answer;
      })
      .catch(err => {
         console.log(err);
      })
}

// Funtion Delete Flashcard
function deleteFlashcard(flashcardId) {
   fetch('/api/deck/flashcard/' + flashcardId, {
      method: 'DELETE',
   })
      .then(response => response.json())
      .then(data => {
         console.log(data);
         const deletedRow = document.getElementById('flashcardRow_' + flashcardId);
         if (deletedRow) {
            deletedRow.remove();
         }
      })
}

// Function Api Edit Flashcard
const editFlashcard = document.getElementById('editFlashcard');
editFlashcard.addEventListener('submit', (e) => {
   e.preventDefault();

   // ! Check Question
   var reg = /^.*$/;
   let regexEditQuestion;
   if (!reg.test(document.getElementById("modalQuestion").value)) {
      regexEditQuestion = "ข้อความเกินกำหนด";
      document.getElementById("modalQuestion").style.border = "1px solid red";
   } else {
      regexEditQuestion = "";
      document.getElementById("modalQuestion").style.border = "1px solid #d1d3e2";
   }
   document.getElementById("regexEditQuestion").innerHTML = regexEditQuestion;

   // ! Check Answer
   // var reg = /^.*$/;
   // let regexEditAnswer;
   // if (!reg.test(document.getElementById("modalAnswer").value)) {
   //   regexEditAnswer = "ข้อความเกินกำหนด";
   //   document.getElementById("modalAnswer").style.border = "1px solid red";
   // } else {
   //   regexEditAnswer = "";
   //   document.getElementById("modalAnswer").style.border = "1px solid #d1d3e2";
   // }
   // document.getElementById("regexEditAnswer").innerHTML = regexEditAnswer;

   if (regexEditQuestion === "") {
      const flashcardId = document.getElementById('inputFlashcardId').value;
      const question = document.getElementById('modalQuestion').value;
      const answer = document.getElementById('modalAnswer').value;

      fetch('/api/deck/flashcard/' + flashcardId, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            card_question: question,
            card_answer: answer,
         }),
      }).then(response => {
         if (!response.ok) {
            return response.json().then(data => {
               throw new Error(data.message);
            });
         }
         return response.json();
      }).then(() => {
         // Update the table row with the edited data
         const editedRow = document.getElementById('flashcardRow_' + flashcardId);
         $('#editFlashcard').modal('hide');
         if (editedRow) {
            editedRow.querySelector('.questionColumn').textContent = question;
            editedRow.querySelector('.answerColumn').textContent = answer;
         }

         // Show success toast
         const ToastTrue = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         ToastTrue.fire({
            icon: "success",
            title: "แก้ไขข้อมูลสำเร็จ"
         });
      }).catch(err => {
         showToastError(err);
      });
   }
});

// ! End Manage Flashcard

// ! Quiz


const selectElement = document.getElementById("questionInput");
selectElement.innerHTML = '<option selected value="">Select...</option>';

fetch('/api/deck/getById/' + deckId, {
   method: 'get',
   headers: {
      'Content-Type': 'application/json'
   },
})
   .then(response => response.json())
   .then(data => {
      const flashcards = data.flashcards;

      flashcards.forEach(flashcard => {
         // console.log(flashcard);
         const option = document.createElement('option');
         option.value = flashcard.card_question;
         option.text = flashcard.card_question;
         selectElement.appendChild(option);
      });

      if (flashcards.length === 0) {
         console.log('ไม่มีข้อมูลใน dataArray');
      }

   })
   .catch(err => console.log(err));

function addFormQuiz() {
   const blockQuiz = document.getElementById('blockQuiz');
   const div = document.createElement('div');
   div.className = 'row'; // เป็นการเพิ่ม class ให้ div
   div.innerHTML = `
      <h3 style="text-align: center;">Question</h3>
      <div class="row mb-3">
      <label for="inputText" class="col-sm-2 col-form-label">Question</label>
      <div class="col-sm-10">
         <select id="questionInput" name="quizQuestion" class="form-select">
            <option selected="" value="">Select...</option>
         </select>
      </div>
      </div>
      <h3 style="text-align: center;">Answer</h3>
      <div class="row mb-3">
      <label for="inputText" class="col-sm-2 col-form-label">Choice 1.</label>
      <div class="col-sm-10">
         <textarea class="form-control" id="Choice1" name="quizChoice1" oninput="updateDropdown()"></textarea>
      </div>
      </div>
      <div class="row mb-3">
      <label for="inputText" class="col-sm-2 col-form-label">Choice 2.</label>
      <div class="col-sm-10">
         <textarea class="form-control" id="Choice2" name="quizChoice2" oninput="updateDropdown()"></textarea>
      </div>
      </div>
      <div class="row mb-3">
      <label for="inputText" class="col-sm-2 col-form-label">Choice 3.</label>
      <div class="col-sm-10">
         <textarea class="form-control" id="Choice3" name="quizChoice3" oninput="updateDropdown()"></textarea>
      </div>
      </div>
      <div class="row mb-3">
      <label for="inputText" class="col-sm-2 col-form-label">Choice 4.</label>
      <div class="col-sm-10">
         <textarea class="form-control" id="Choice4" name="quizChoice4" oninput="updateDropdown()"></textarea>
      </div>
      </div>
      <div class="row mb-3">
      <label for="inputText" class="col-sm-2 col-form-label">Correct Answer</label>
      <div class="col-sm-10">
         <select id="inputState" name="quizAnswerCorrect" class="form-select">
            <option selected="" value="">Select...</option>
         </select>
      </div>
      </div>
      <div class="row text-end">
      <div class="col-12">
         <button type="button" class="btn btn-success" id="btnAddFormQuiz" onclick="checkQuizForm()"
            style="font-weight: bold;">
            <i class="bi bi-plus-circle"></i>Add 
         </button>
         <button type="button" class="btn btn-danger" id="addBtn" onclick="delFormQuiz()" style="font-weight: bold;"><i  class="bi bi-trash"></i> Del
         </button>
      </div>
      </div>
      <hr class="my-4" style="border: 2px solid black;border-radius: 2px;">
      `;
   blockQuiz.appendChild(div);

   // Fetch data and populate the newly created select element
   fetch('/api/deck/getById/' + deckId, {
      method: 'get',
      headers: {
         'Content-Type': 'application/json'
      },
   })
      .then(response => response.json())
      .then(data => {
         const selectElement = div.querySelector('#questionInput');
         const flashcards = data.flashcards;

         flashcards.forEach(flashcard => {
            const option = document.createElement('option');
            option.value = flashcard.card_question;
            option.text = flashcard.card_question;
            selectElement.appendChild(option);
         });

         if (flashcards.length === 0) {
            console.log('ไม่มีข้อมูลใน dataArray');
         }
      })
      .catch(err => console.log(err));
}


const formAddQuiz = document.getElementById('formAddQuiz');
formAddQuiz.addEventListener('submit', async (e) => {
   e.preventDefault();

   const quizQuestion = document.querySelectorAll('select[name="quizQuestion"]');
   const quizchoices1 = document.querySelectorAll('textarea[name="quizChoice1"]');
   const quizchoices2 = document.querySelectorAll('textarea[name="quizChoice2"]');
   const quizchoices3 = document.querySelectorAll('textarea[name="quizChoice3"]');
   const quizchoices4 = document.querySelectorAll('textarea[name="quizChoice4"]');
   // const selectedOptions = document.querySelectorAll('.form-select');
   const selectedOptions = document.querySelectorAll('select[name="quizAnswerCorrect"]');
   const data = [];

   let checkEmptyField = false;

   quizQuestion.forEach((quizQuestion, index) => {
      const quizChoice1 = quizchoices1[index].value.trim();
      const quizChoice2 = quizchoices2[index].value.trim();
      const quizChoice3 = quizchoices3[index].value.trim();
      const quizChoice4 = quizchoices4[index].value.trim();
      const selectedOptionElement = selectedOptions[index];
      const selectedOption = selectedOptionElement.value.trim();

      if (quizQuestion.value.trim() === '' || quizChoice1 === '' || quizChoice2 === '' || quizChoice3 === '' || quizChoice4 === '' || selectedOption === '') {
         checkEmptyField = true;
         return;
      }

      data.push({
         quiz_question: quizQuestion.value.trim(),
         quiz_choice: [quizChoice1, quizChoice2, quizChoice3, quizChoice4],
         quiz_answerCorrect: selectedOption,
         deck_id: deckId
      });
   });

   if (checkEmptyField) {
      alert('Please fill in all fields.');
      return;
   }

   try {
      fetch('/projectsenior/quiz/' + deckId, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ data: data })
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
               title: "Create Quiz successfully"
            }).then(() => {
               window.location.reload();
            });
         })
         .catch(err => console.log(err));
   } catch (error) {
      console.error('Error adding quiz:', error.message);
   }
});

// Get Quiz to show in table
fetch('/api/deck/quiz/' + deckId, {
   method: 'GET',
   headers: {
      'Content-Type': 'application/json'
   },
})
   .then(response => response.json())
   .then(data => {
      // console.log(data);
      let html = '';
      data.forEach((item, index) => {
         // console.log(item);
         html += `
            <tr id="quizRow_${item._id}">
               <td>${index + 1}</td>
               <td>${item._id}</td>
               <td>${item.quiz_question}</td>
               <td>${item.quiz_choice[0]}</td>
               <td>${item.quiz_choice[1]}</td>
               <td>${item.quiz_choice[2]}</td>
               <td>${item.quiz_choice[3]}</td>
               <td>${item.quiz_answerCorrect}</td>
               <td>${item.deck_id}</td>
               <td>
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editQuiz"
                  onclick="getDetailEditQuiz('${item._id}')">
                     Edit
                  </button>
               </td>
               <td>
                  <button type="button" class="btn btn-danger" onclick="deleteQuiz('${item._id}')">
                     Delete
                  </button>
               </td>
            </tr>
         `;
      })
      document.getElementById('quizTableBody').innerHTML = html;
      $(document).ready(function () {
         $('#dataTableQuiz').DataTable();
      });
   })

// !Modal Edit Quiz

// Get detail quiz to edit
function getDetailEditQuiz(quizId) {
   // ดึงข้อมูล Quiz จาก API
   fetch('/api/deck/quiz/getById/' + quizId, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      },
   })
      .then(response => response.json())
      .then(data => {
         // console.log(data);
         $('#inputQuizId').val(data._id);
         $('#modalChoice1').val(data.quiz_choice[0]);
         $('#modalChoice2').val(data.quiz_choice[1]);
         $('#modalChoice3').val(data.quiz_choice[2]);
         $('#modalChoice4').val(data.quiz_choice[3]);
         // แสดงค่าข้อมูล Quiz ใน Modal

         $('#inputModalState').empty();

         // Get quiz_answerCorrect in select option & add option quiz_choice
         for (let i = 0; i < data.quiz_choice.length; i++) {
            $('#inputModalState').append(`<option value="${data.quiz_choice[i]}">${data.quiz_choice[i]}</option>`);
         }
         $('#inputModalState').val(data.quiz_answerCorrect);



         const selectElement = document.getElementById("modalQuestionInput");
         selectElement.innerHTML = '';

         // ดึงข้อมูล Flashcard จาก API
         fetch('/api/deck/getById/' + deckId, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
         })
            .then(response => response.json())
            .then(flashcardData => {
               const flashcards = flashcardData.flashcards;

               // เพิ่ม options จาก Flashcards ใน Modal
               flashcards.forEach(flashcard => {
                  const option = document.createElement('option');
                  option.value = flashcard.card_question;
                  option.textContent = flashcard.card_question;
                  selectElement.appendChild(option);
               });

               // ทำการเลือกค่า quiz_question เมื่อได้รับข้อมูล Flashcard สำเร็จ
               selectElement.value = data.quiz_question;

               if (flashcards.length === 0) {
                  console.log('ไม่มีข้อมูลใน Flashcards');
               }
            })
            .catch(err => console.log(err));
      })
      .catch(err => {
         console.log(err);
      });
}


// Funtion Delete Flashcard
function deleteFlashcard(flashcardId) {
   fetch('/api/deck/flashcard/' + flashcardId, {
      method: 'DELETE',
   })
      .then(response => response.json())
      .then(data => {
         console.log(data);
         const deletedRow = document.getElementById('flashcardRow_' + flashcardId);
         if (deletedRow) {
            deletedRow.remove();
         }
      })
}

const formModalAddQuiz = document.getElementById('formModalAddQuiz');
formModalAddQuiz.addEventListener('submit', async (e) => {
   e.preventDefault();

   const quizQuestion = document.querySelectorAll('select[name="quizModalQuestion"]');
   const quizchoices1 = document.querySelectorAll('textarea[name="modalQuizChoice1"]');
   const quizchoices2 = document.querySelectorAll('textarea[name="modalQuizChoice2"]');
   const quizchoices3 = document.querySelectorAll('textarea[name="modalQuizChoice3"]');
   const quizchoices4 = document.querySelectorAll('textarea[name="modalQuizChoice4"]');
   // const selectedOptions = document.querySelectorAll('.form-select');
   const selectedOptions = document.querySelectorAll('select[name="modalQuizAnswer"]');
   const data = [];

   let checkEmptyField = false;

   quizQuestion.forEach((quizQuestion, index) => {
      const quizChoice1 = quizchoices1[index].value.trim();
      const quizChoice2 = quizchoices2[index].value.trim();
      const quizChoice3 = quizchoices3[index].value.trim();
      const quizChoice4 = quizchoices4[index].value.trim();
      const selectedOptionElement = selectedOptions[index];
      const selectedOption = selectedOptionElement.value.trim();

      if (quizQuestion.value.trim() === '' || quizChoice1 === '' || quizChoice2 === '' || quizChoice3 === '' || quizChoice4 === '' || selectedOption === '') {
         checkEmptyField = true;
         return;
      }

      data.push({
         quiz_question: quizQuestion.value.trim(),
         quiz_choice: [quizChoice1, quizChoice2, quizChoice3, quizChoice4],
         quiz_answerCorrect: selectedOption,
      });
   });

   if (checkEmptyField) {
      alert('Please fill in all fields.');
      return;
   }

   try {
      fetch('/projectsenior/quiz/' + deckId, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ data: data })
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
               title: "Update Quiz successfully"
            }).then(() => {
               window.location.reload();
            });
         })
         .catch(err => console.log(err));
   } catch (error) {
      console.error('Error adding quiz:', error.message);
   }
});

// ! End Quiz

// SweetAlert Success
function showToast(titleText) {
   const ToastTrue = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
         toast.onmouseenter = Swal.stopTimer;
         toast.onmouseleave = Swal.resumeTimer;
      }
   });
   ToastTrue.fire({
      icon: "success",
      title: titleText
   }).then(() => {
      location.reload();
   })
}

// SweetAlert Error
function showToastError(err) {
   const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
         toast.onmouseenter = Swal.stopTimer;
         toast.onmouseleave = Swal.resumeTimer;
      }
   });
   Toast.fire({
      icon: "error",
      title: err
   })
}