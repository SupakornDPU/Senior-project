fetch(`/projectsenior/index`, {})
.then(response => response.json())
.then(data => {
   console.log('Logged in user:', data.loggedIn);
   console.log('Role:', data.role);
   if (data.loggedIn) {
      document.getElementById('loginButton').style.display = 'none';
      document.getElementById('registerButton').style.display = 'none';
      document.getElementById('logoutButton').style.display = 'block';
      if (data.role == 'Student') {
         const menuClassroom = document.getElementById('menuClassroom');
         menuClassroom.href = 'classroom_student.html';
      } else if (data.role == 'Teacher') {
         const menuClassroom = document.getElementById('menuClassroom');
         menuClassroom.href = 'classroom.html';
      }
   } else {
      document.getElementById('menuClassroom').href = 'login.html';
      document.getElementById('loginButton').style.display = 'block';
      document.getElementById('registerButton').style.display = 'block';
      document.getElementById('logoutButton').style.display = 'none';
   }
})
.catch((error) => {
   console.error('Error:', error);
});