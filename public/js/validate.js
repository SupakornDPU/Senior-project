function checkValidate() {
    
    // ! Check Email
    var reg = /^\S*[^0-9]$/;
    let textEmail;
    if (!reg.test(document.getElementById("typeEmail").value)) {
        textEmail = "กรุณากรอก อีเมล.";
    } else {
        textEmail = "";
    }
    document.getElementById("textEmail").innerHTML = textEmail;


    // ! Check Password
    var regPassword = /^[-\w\.\$@\*\!]{1,30}$/;
    let textPassword;

    if (!regPassword.test(document.getElementById("typePassword").value)) {
        textPassword = "กรุณากรอก รหัสผ่าน.";
    } else {
        textPassword = "";
    }
    document.getElementById("textPassword").innerHTML = textPassword;

    // ! Check Firstname
    var reg = /^\S*[^0-9]$/;
    let textFirstname;
    if (!reg.test(document.getElementById("typeFirstname").value)) {
        textFirstname = "กรุณากรอก ชื่อจริง.";
    } else {
        textFirstname = "";
    }
    document.getElementById("textFirstname").innerHTML = textFirstname;

    // ! Check Lastname
    var reg = /^\S*[^0-9]$/;
    let textLastname;
    if (!reg.test(document.getElementById("typeLastname").value)) {
        textLastname = "กรุณากรอก นามสกุล.";
    } else {
        textLastname = "";
    }
    document.getElementById("textLastname").innerHTML = textLastname;

    var reg = /^\S*[^0-9]$/;
    let textRole;
    if (!reg.test(document.getElementById("roleForm").value)) {
        textRole = "กรุณาเลือกโรล.";
    } else {
        textRole = "";
    }
    document.getElementById("textrole").innerHTML = textRole;

    
}