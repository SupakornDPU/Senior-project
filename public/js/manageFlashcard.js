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
      .then(data => {
         console.log(data);
         // console.log(deckId);
      });
});

const formImports = document.getElementById('importQA');
formImports.addEventListener('submit', (e) => {
   e.preventDefault();

   // ดึงข้อมูลจาก textarea ทั้งหมด
   const questions = document.querySelectorAll('textarea[name="question"]');
   const answers = document.querySelectorAll('textarea[name="answer"]');
   const deckids = deckId;
   const data = [];

   // สร้างอาเรย์ของอ็อบเจ็กต์เพื่อเก็บข้อมูลจากทุก textarea
   questions.forEach((question, index) => {
      console.log(deckids);
      data.push({
         question: question.value,
         answer: answers[index].value,
         deckid : deckids
      });
   });
   console.log(data)
   // ทำ Fetch เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์ Node.js
   fetch('/projectsenior/flashcard/' + deckId, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
   })
      .then(response => response.json())
      .then(result =>{
         console.log(result);

         // Reset textarea values
         questions.forEach(question => (question.value = ''));
         answers.forEach(answer => (answer.value = ''));

         alert("เพิ่มสำเร็จ");
      })
      .catch(err => console.log(err));
});
