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
                     ${each.deck_name} <a class="button" id="btnupdatedeck" href="#formeditdeck" onclick="btnupdatedeck('${each._id}')" ><i class="fa-solid fa-gear"></i></a>
                  </div>
                  <div class="ag-courses-item_date-box">
                     <div class="row mb-2">
                        <div class="col-md-12">
                           <a class="btn btn-primary font-poppin" href="flashcard.html?deck=${each._id}" role="button" style="font-weight: bold;">Learning</a>
                        </div>
                     </div>
                     <div class="row mb-2">
                        <div class="col-md-12">
                           <a class="btn btn-primary font-poppin" href="manageFlashcard.html" role="button" style="font-weight: bold;">Manage Flash card</a>
                        </div>
                     </div>
                     <div class="row mb-2">
                        <div class="col-md-12">
                           <a class="btn btn-primary font-poppin" href="scoreboard.html" role="button" style="font-weight: bold;">Score Board</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         `;
         decks.appendChild(deckCol);
      });
   })
   .catch(err => console.log(err))

   
   function btncreatedeck() {
      document.location = "createFlashcard.html?classroomID="+classroomID;
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
      fetch('/projectsenior/deck/' + DeckID, {
         method: 'DELETE',
      })
         .then(response => response.json())
         .then(() => {
            alert("ลบห้องเรียนเรียบร้อย")
            document.location = "deck.html?classroomID="+classroomID;
         })
         .catch(err => console.log(err))
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
            .catch(err => console.log(err))
            .then(() => {
               alert("แก้ไขห้องเรียนเรียบร้อย")
               document.location = "deck.html?classroomID="+classroomID;
            })
         document.getElementById("nameroom").value = "";
         document.getElementById("description").value = "";
      })