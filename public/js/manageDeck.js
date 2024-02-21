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
               <td class="quizQuestion">${item.quiz_question}</td>
               <td class="quizChoice1">${item.quiz_choice[0]}</td>
               <td class="quizChoice2">${item.quiz_choice[1]}</td>
               <td class="quizChoice3">${item.quiz_choice[2]}</td>
               <td class="quizChoice4">${item.quiz_choice[3]}</td>
               <td class="quizAnsCorrect">${item.quiz_answerCorrect}</td>
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
function deleteQuiz(quizId) {
   fetch('/api/deck/quiz/del/' + quizId, {
      method: 'DELETE',
   })
      .then(response => response.json())
      .then(data => {
         console.log(data);
         const deletedRow = document.getElementById('quizRow_' + quizId);
         if (deletedRow) {
            deletedRow.remove();
         }
      })
}

const formModalAddQuiz = document.getElementById('formModalAddQuiz');
formModalAddQuiz.addEventListener('submit', async (e) => {
   e.preventDefault();

   const quizId = document.getElementById('inputQuizId').value;
   const quizQuestion = document.querySelectorAll('select[name="quizModalQuestion"]');
   const quizchoices1 = document.querySelectorAll('textarea[name="modalQuizChoice1"]');
   const quizchoices2 = document.querySelectorAll('textarea[name="modalQuizChoice2"]');
   const quizchoices3 = document.querySelectorAll('textarea[name="modalQuizChoice3"]');
   const quizchoices4 = document.querySelectorAll('textarea[name="modalQuizChoice4"]');
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

   // Extracting the data from the first element since we're updating only one quiz
   const quiz_question = data[0].quiz_question;
   const quiz_choice = data[0].quiz_choice;
   const quiz_answerCorrect = data[0].quiz_answerCorrect;

   fetch('/api/deck/quiz/update/' + quizId, {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         quiz_question: quiz_question,
         quiz_choice: quiz_choice,
         quiz_answerCorrect: quiz_answerCorrect,
      })
   })
      .then(response => {
         if (!response.ok) {
            throw new Error('Failed to update quiz');
         }
         return response.json();
      })
      .then(() => {
         // ํUpdate the table row with the edited data
         const editedRow = document.getElementById('quizRow_' + quizId);
         $('#editQuiz').modal('hide');
         if (editedRow) {
            editedRow.querySelector('.quizQuestion').textContent = quiz_question;
            editedRow.querySelector('.quizChoice1').textContent = quiz_choice[0];
            editedRow.querySelector('.quizChoice2').textContent = quiz_choice[1];
            editedRow.querySelector('.quizChoice3').textContent = quiz_choice[2];
            editedRow.querySelector('.quizChoice4').textContent = quiz_choice[3];
            editedRow.querySelector('.quizAnsCorrect').textContent = quiz_answerCorrect;
         }
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
            })
         })
      .catch(err => {
         console.error('Error update quiz:', err.message);
      });
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