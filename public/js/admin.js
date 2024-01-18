function regexTeacher() {
  const teacherForm = document.getElementById('teacherForm');
  teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // ! Check Email
    var reg = /^\S*[^0-9]$/;
    let regexEmail;
    if (!reg.test(document.getElementById("typeEmail").value)) {
      regexEmail = "กรุณากรอก อีเมล.";
      document.getElementById("typeEmail").style.color = "red";
    } else {
      regexEmail = "";
      document.getElementById("typeEmail").style.color = "black";
    }
    document.getElementById("regexEmail").innerHTML = regexEmail;

    // ! Check Password
    // var regPassword = /^[a-zA-Z0-9]{1,30}$/;
    var regPassword = /^[-\w]{1,30}$/;
    let regexPassword;

    if (!regPassword.test(document.getElementById("typePassword").value)) {
      regexPassword = "กรุณากรอก รหัสผ่าน.";
    } else {
      regexPassword = "";
    }
    document.getElementById("regexPassword").innerHTML = regexPassword;

    // ! Check Firstname
    var reg = /^[a-zA-Z]+$/;
    let regexFirstname;
    if (!reg.test(document.getElementById("typeFirstname").value)) {
      regexFirstname = "กรุณากรอก ชื่อจริง.";
    } else {
      regexFirstname = "";
    }
    document.getElementById("regexFirstname").innerHTML = regexFirstname;

    // ! Check Lastname
    var reg = /^[a-zA-Z]+$/;
    let regexLastname;
    if (!reg.test(document.getElementById("typeLastname").value)) {
      regexLastname = "กรุณากรอก นามสกุล.";
    } else {
      regexLastname = "";
    }
    document.getElementById("regexLastname").innerHTML = regexLastname;

    if (regexEmail === "" && regexPassword === "" && regexFirstname === "" && regexLastname === "") {
      const teacherEmail = document.getElementById('typeEmail').value;
      const teacherPassword = document.getElementById('typePassword').value;
      const teacherFirstname = document.getElementById('typeFirstname').value;
      const teacherLastname = document.getElementById('typeLastname').value;

      fetch(`/projectsenior/admin/teacher/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "user_email": teacherEmail,
          "user_password": teacherPassword,
          "user_firstname": teacherFirstname,
          "user_lastname": teacherLastname,
          "user_role": 'Teacher',
        })
      }).then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message);
          });
        }
        return response.json();
      }).then(() => {
        // SweetAlert
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
          title: "เพิ่มข้อมูลสำเร็จแล้ว"
        }).then(() => {
          location.reload();
        })
      }).catch(err => {

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
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
      });
    }

  });
}


