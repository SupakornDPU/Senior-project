// POST import excel file
const fileInput = document.getElementById('formFile');
const formImport = document.getElementById('formImport');

formImport.addEventListener('submit', (e) => {
   e.preventDefault();

   const formData = new FormData();
   formData.append('file', fileInput.files[0]);

   fetch('/projectsenior/flashcard/import/', {
         method: 'POST',
         body: formData
      })
      .then(res => res.json())
      .then(data => {
         console.log(data);
         // const dataArray = [];
         // data.Sheet1.forEach(each => {
         //    dataArray.push(each);
         // });
         // console.log(dataArray);
      });
});