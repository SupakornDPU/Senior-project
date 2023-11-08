const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
   e.preventDefault();

   const user_email = document.getElementById('typeEmail').value;
   const user_password = document.getElementById('typePassword').value;
   let textEmail;

   fetch(`/projectsenior/loginUser`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         "user_email": user_email,
         "user_password": user_password,
      })
   }).then(response => response.json())
      .then(data => {
         console.log('Success:', data);
         if (data.message === "Login Fail") {
            // window.location.href = "login.html";
            textEmail = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            document.getElementById("alertBox").style.display = "block";
            document.getElementById("textAlert").innerHTML = textEmail;
         } else {
            textEmail = "";
            document.getElementById("alertBox").style.display = "none";
            document.getElementById("textAlert").innerHTML = textEmail;
            window.location.href = "index.html";
         }
      })
      .catch(error => console.log(error));
})