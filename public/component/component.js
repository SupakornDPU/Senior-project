// Navbar
class NavBar extends HTMLElement {
   constructor() {
      super();
   }

   connectedCallback() {
      this.innerHTML = `
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
         <!-- Container wrapper -->
         <div class="container">
            <!-- Navbar brand -->
            <a class="navbar-brand me-2" href="https://mdbgo.com/">
               <img src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp" height="16" alt="MDB Logo"
                  loading="lazy" style="margin-top: -1px;" />
            </a>

            <!-- Toggle button -->
            <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarButtonsExample"
               aria-controls="navbarButtonsExample" aria-expanded="false" aria-label="Toggle navigation">
               <i class="fas fa-bars"></i>
            </button>

            <!-- Collapsible wrapper -->
            <div class="collapse navbar-collapse" id="navbarButtonsExample">
               <!-- Left links -->
               <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                     <a class="nav-link font-poppin" href="index.html">Home</a>
                  </li>
                  <li class="nav-item">
                     <a class="nav-link font-poppin" href="#">Classroom</a>
                  </li>
                  <li class="nav-item">
                     <a class="nav-link font-poppin" href="#">About</a>
                  </li>
               </ul>
               <!-- Left links -->

               <div class="d-flex align-items-center">
                  <button type="button" class="btn btn-link px-3 me-2 font-poppin">
                     Login
                  </button>
                  <button type="button" class="btn btn-primary me-3 font-poppin">
                     Sign up for free
                  </button>
               </div>
            </div>
            <!-- Collapsible wrapper -->
         </div>
         <!-- Container wrapper -->
      </nav>
      <!-- Navbar -->`
   }
}

customElements.define('navbar-component', NavBar);

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
      </footer>`
   }
}

customElements.define('footer-component', Footer);