<template>
  <div class="container-fluid" style="background:rgb(0, 0, 0); color: white">
    <footer>
      <div class="row p-5 d-flex justify-content-left" style="background-color: rgb(0, 0, 0)">
        <div class="col col-3 p-2" style="color: white">
          <h6 class="text-sm-center mb-5" >TEAM</h6>
          <div class="m-3">
            <p style="font-size: 15px; margin-bottom: 5px;"><span style="font-weight: bold;">CORE TEAM:</span> SHYAM LAL, DR.NIKITA SIMPSON & SOUJANYAA BORUAH </p>
            <p style="font-size: 15px; margin-bottom: 5px;"><span style="font-weight: bold;">RESOURCE PERSON:</span> RINTU RAM, RINKU KAPOOR, MITTHU CHURAHI</p>
            <p style="font-size: 15px; margin-bottom: 5px;"><span style="font-weight: bold;">DOCUMENTATION:</span> SURAJ GUPTA, DOLLY D.</p>
            <p style="font-size: 15px; margin-bottom: 5px;"><span style="font-weight: bold;">WEB DESIGN & DEVELOPMENT:</span> BRIX STUDIO & LOBSANG SANDUP</p>
          </div>
        </div>
        <div class="col col-3 p-2">
          <h6 class="text-sm-center mb-5" >CONTACT</h6>
          <p style="font-size: 15px; margin-bottom: 5px;"><img src="/icons/email.svg" alt="Email" style="width: 20px; height: 20px; margin-right: 20px;"><span style="font-weight: bold;">EMAIL:</span> info@tensionproject.com</p>
          <p style="font-size: 15px; margin-bottom: 5px;"><img src="/icons/location.svg" alt="Location" style="width: 20px; height: 20px; margin-right: 20px;"><span style="font-weight: bold;">PHONE:</span> +91 9876543210</p>
        </div>
        <div class="col col-3 p-2">
          <h6 class="text-sm-center" >NAVIGATION</h6>
          <nav class="nav flex-column mt-5" style="font-size: 15px;">
            <router-link to="/" class="nav-link">HOME</router-link>
            <router-link to="/articles" class="nav-link">WRITTINGS</router-link>
            <router-link to="/art" class="nav-link">ART</router-link>
          </nav>
        </div>
        <div class="col col-3 p-2">
          <h6 class="text-sm-center mb-5" >SUPPORTS & SPONSORS</h6>
          <div class="d-flex flex-column mt-4">
            <img src="/soas.svg" alt="SOAS University of London" style="width: 130px; height: 90px; object-fit: contain;">
            <img src="/fica.svg" alt="FICA" style="width: 180px; height: 140px; object-fit: contain; margin-bottom: 0;">
          </div>
        </div>
      </div>
      <hr style="border-top: 1px solid rgba(255, 255, 255); margin: 0;"/>
      
      <div class="p-4 text-lg-end" >
          <p>© 2024</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-link {
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
}

.nav-link:hover {
  color: #ccc;
}
</style>
