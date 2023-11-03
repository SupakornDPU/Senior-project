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
         const classroomCol = document.createElement('div');
         classroomCol.className = 'ag-courses_item';
         classroomCol.innerHTML = `
               <div href="#" class="ag-courses-item_link" id=${each._id}>
                  <div class="ag-courses-item_bg"></div>
                  <div class="ag-courses-item_title">
                     ${each.deck_name}
                  </div>
                  <div class="ag-courses-item_date-box">
                     <div class="row mb-2">
                        <div class="col-md-12">
                           <a class="btn btn-primary font-poppin" href="exflash.html" role="button" style="font-weight: bold;">Learning</a>
                        </div>
                     </div>
                     <div class="row mb-3">
                        <div class="col-md-12">
                           <a class="btn btn-primary font-poppin" href="manageFlashcard.html" role="button" style="font-weight: bold;">Manage Flash card</a>
                        </div>
                     </div>
                     <div class="row mb-3">
                        <div class="col-md-12">
                           <a class="btn btn-primary font-poppin" href="scoreboard.html" role="button" style="font-weight: bold;">Score Board</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         `;
         decks.appendChild(classroomCol);
      });
   })
   .catch(err => console.log(err))

   function btncreatedeck() {
      document.location = "createFlashcard.html?classroomID="+classroomID;
   }