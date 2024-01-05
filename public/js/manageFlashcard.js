const urlParams = new URLSearchParams(window.location.search);
const deckId = urlParams.get('deck')
console.log(deckId);

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
        title: "Import successfully"
      }).then(() => {
        window.location = "manageFlashcard?deck=" + deckId;
      });
    })
    .then(() => {
      console.log(data);
    })
});

// POST import textarea
const textareaForm = document.getElementById('textareaForm');
textareaForm.addEventListener('submit', (e) => {
   e.preventDefault();

   const questions = document.querySelectorAll('textarea[name="question"]');
   const answers = document.querySelectorAll('textarea[name="answer"]');
   const deckids = deckId;
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
         deckid: deckids
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
      .then(() =>{
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
            window.location = "manageFlashcard?deck=" + deckId;
         });

         // Reset textarea values
         questions.forEach(question => (question.value = ''));
         answers.forEach(answer => (answer.value = ''));
      })
      .catch(err => console.log(err));
});
