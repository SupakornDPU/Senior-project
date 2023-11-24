      // GET DATA USER
      fetch(`/projectsenior/index`, {})
         .then(response => response.json())
         .then(data => {
            const a = document.getElementById("studentId");
            a.value = data.loggedIn
            console.log('Logged in user:', data.loggedIn);
            console.log('Role:', data.role);

            // GET DATA CLASSROOM WITH USERID
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
                           <h5 class="fw-bold">${each.classroom_name}<p>${each.classroom_creator}</p></h5>
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

      // PUT DATA CLASSROOM WITH USERID
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
            .then(response => console.log(response))
            .then(() => {
               alert("เพิ่มห้องเรียนเรียบร้อย")
               window.location.href = " classroom_student.html "
            })
            .catch(err => console.log(err))
      })