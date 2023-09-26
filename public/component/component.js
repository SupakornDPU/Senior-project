// Navbar
class NavBar extends HTMLElement {
   constructor() {
      super();
   }

   connectedCallback() {
      this.innerHTML = `
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg sticky-top font-poppin navbar-dark bg-dark">
      <div class="container">
         <a class="navbar-brand" href="index.html">PyFlash</a>
         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
            aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
         </button>
         <div class="collapse navbar-collapse" id="navbarColor01">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
               <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="index.html">Home</a>
               </li>
               <li class="nav-item">
                  <a class="nav-link" href="classroomFlashcard.html">Classroom</a>
               </li>
               <li class="nav-item">
                  <a class="nav-link" href="#">About</a>
               </li>
            </ul>
            <form class="d-flex gap-2">
               <a name="" id="" class="btn btn-primary btn-login" href="login.html" role="button">Login</a>
               <a name="" id="" class="btn btn-primary" href="register.html" role="button">Register</a>
            </form>
         </div>
      </div>
   </nav>
   <!-- Navbar -->`;
   }
}

customElements.define("navbar-component", NavBar);

// Footer
class Footer extends HTMLElement {
   constructor() {
      super();
   }

   connectedCallback() {
      this.innerHTML = `
      <!-- Footer -->
      <footer class="footer-59391">
         <div class="container">
            <div class="row align-items-center justify-content-center text-center">
               <div class="col-lg-4 text-lg-center site-logo order-1 order-lg-2 mb-3 mb-lg-0">
                  <a href="#" class="m-0 p-0">PyFlash</a>
               </div>
               <div class="col-lg-4 order-2 order-lg-1 mb-3 mb-lg-0">
                  <ul class="list-unstyled nav-links m-0 nav-left">
                     <li><a href="#">Terms</a></li>
                     <li><a href="#">About</a></li>
                     <li><a href="#">Privacy</a></li>
                     <li><a href="#">Contact</a></li>
                  </ul>
               </div>
   
               <div class="col-lg-4 text-lg-right order-3 order-lg-3">
                  <p class="m-0 text-muted"><small>&copy; 2019. All Rights Reserved.</small></p>
               </div>
            </div>
         </div>
      </footer>`;
   }
}

customElements.define("footer-component", Footer);
