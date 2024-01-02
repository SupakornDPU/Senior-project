const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // ! Check Email
    var reg = /^\S*[^0-9]$/;
    let textEmail;
    if (!reg.test(document.getElementById("typeEmail").value)) {
        textEmail = "กรุณากรอก อีเมล.";
        document.getElementById("typeEmail").style.color = "red";
    } else {
        textEmail = "";
        document.getElementById("typeEmail").style.color = "black";
    }
    document.getElementById("textEmail").innerHTML = textEmail;

    // ! Check Password
    // var regPassword = /^[a-zA-Z0-9]{1,30}$/;
    var regPassword = /^[-\w]{1,30}$/;
    let textPassword;

    if (!regPassword.test(document.getElementById("typePassword").value)) {
        textPassword = "กรุณากรอก รหัสผ่าน.";
    } else {
        textPassword = "";
    }
    document.getElementById("textPassword").innerHTML = textPassword;

    // ! Check Firstname
    var reg = /^[a-zA-Z]+$/;
    let textFirstname;
    if (!reg.test(document.getElementById("typeFirstname").value)) {
        textFirstname = "กรุณากรอก ชื่อจริง.";
    } else {
        textFirstname = "";
    }
    document.getElementById("textFirstname").innerHTML = textFirstname;

    // ! Check Lastname
    var reg = /^[a-zA-Z]+$/;
    let textLastname;
    if (!reg.test(document.getElementById("typeLastname").value)) {
        textLastname = "กรุณากรอก นามสกุล.";
    } else {
        textLastname = "";
    }
    document.getElementById("textLastname").innerHTML = textLastname;

    let selectedRole = document.getElementById("roleForm").value;
    let textRole;
    if (selectedRole === "Student" || selectedRole === "Teacher") {
        textRole = "";
    } else {
        textRole = "กรุณาเลือกโรล.";
    }
    document.getElementById("textrole").innerHTML = textRole;
    
    // ตรวจสอบว่าทุกอย่างถูกต้องก่อนส่งฟอร์ม
    if (textEmail === "" && textPassword === "" && textFirstname === "" && textLastname === "" && textRole === "") {
        // ส่งฟอร์มไปยังเซิร์ฟเวอร์
        const registerForm = document.getElementById('registerForm');

        const user_email = document.getElementById('typeEmail').value;
        const user_password = document.getElementById('typePassword').value;
        const user_firstname = document.getElementById('typeFirstname').value;
        const user_lastname = document.getElementById('typeLastname').value;
        let roleSelect = document.getElementById("roleForm");
        const user_role = roleSelect.value;

        fetch(`/teacher/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_email": user_email,
                "user_firstname": user_firstname,
                "user_lastname": user_lastname,
                "user_password": user_password,
                "user_role": user_role,
            })
        }).then(response => {
            if (response.status === 400) {
                return response.json().then(() => {
                    document.getElementById("textEmail").innerHTML = "อีเมลนี้มีผู้ใช้งานแล้ว";
                })
            } else {
                return response.json()
                .then(data => {
                    document.getElementById("textEmail").innerHTML = "";
                    console.log('Success:', data);
                    window.location.href = "login";
                })
            }
        })
        .catch(error => console.log(error));
    }
})