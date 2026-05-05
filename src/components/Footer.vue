<template>
  <div class="footer-shell container-fluid px-0">
    <footer class="site-footer">
      <div class="row footer-row g-4 g-md-5">
        <div class="col-12 col-md-6 col-xl-3">
          <h6 class="footer-heading">TEAM</h6>
          <div class="footer-copy">
            <p>
              <span>CORE TEAM:</span> SHYAM LAL, DR.NIKITA SIMPSON & SOUJANYAA BORUAH
            </p>
            <p>
              <span>COLLABORATORS:</span> SARTAJ GHUMAN & FICA (FOUNDATION FOR INDIAN
              CONTEMPORARY ART)
            </p>
            <p><span>RESOURCE PERSON:</span> RINTU RAM, RINKU KAPOOR, MITTHU CHURAHI</p>
            <p><span>DOCUMENTATION:</span> SURAJ GUPTA, DOLLY D.</p>
            <p><span>WEB DESIGN & DEVELOPMENT:</span> SOUJANYAA BORUAH & LOBSANG SANDUP</p>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <h6 class="footer-heading">CONTACT</h6>
          <div class="footer-contact">
            <p>
              <img src="/icons/email.svg" alt="Email" class="contact-icon" />
              <span class="contact-text">
                <span class="contact-label">ACADEMIC INQUIRIES:</span> ns53@soas.ac.uk
              </span>
            </p>
            <p>
              <img src="/icons/email.svg" alt="Email" class="contact-icon" />
              <span class="contact-text">
                <span class="contact-label">ART INQUIRIES:</span> soujanyaa@vaquum.fi
              </span>
            </p>
            <p>
              <img src="/icons/email.svg" alt="Email" class="contact-icon" />
              <span class="contact-text">
                <span class="contact-label">FIELD INQUIRIES:</span> shyam.himalayanshepherd@gmail.com
              </span>
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <h6 class="footer-heading">NAVIGATION</h6>
          <nav class="footer-nav">
            <router-link to="/" class="footer-link">HOME</router-link>
            <router-link to="/articles" class="footer-link">WRITTINGS</router-link>
            <router-link to="/art" class="footer-link">ART</router-link>
            <router-link to="/exhibition" class="footer-link">EXHIBITION</router-link>
          </nav>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <h6 class="footer-heading">SUPPORTS & SPONSORS</h6>
          <div class="footer-sponsors">
            <img src="/soas.png" alt="SOAS University of London" class="sponsor-logo soas-logo" />
            <img src="/fica.svg" alt="FICA" class="sponsor-logo fica-logo" />
          </div>
        </div>
      </div>
      <hr class="footer-divider" />
      <div class="footer-bottom">
        <p>© 2024</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer-shell {
  background: rgb(0, 0, 0);
  color: white;
}

.site-footer {
  padding: 2.25rem 1rem 0;
}

.footer-row {
  margin: 0;
  padding-bottom: 2rem;
}

.footer-heading {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.footer-copy p,
.footer-contact p {
  margin-bottom: 0.45rem;
  font-size: 0.8rem;
  line-height: 1.5;
}

.footer-copy p:last-child,
.footer-contact p:last-child {
  margin-bottom: 0;
}

.footer-copy span,
.footer-contact .contact-label {
  font-weight: 700;
}

.footer-contact p {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
}

.contact-text {
  flex: 1 1 auto;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.contact-icon {
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.95rem;
}

.footer-link {
  width: fit-content;
  color: white;
  text-decoration: none;
}

.footer-link:hover {
  color: #ccc;
  background-color: transparent;
}

.footer-sponsors {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.sponsor-logo {
  object-fit: contain;
  display: block;
}

.soas-logo {
  width: 180px;
  height: auto;
}

.fica-logo {
  width: 180px;
  height: 140px;
}

.footer-divider {
  border-top: 1px solid rgba(255, 255, 255);
  margin: 0;
}

.footer-bottom {
  padding: 1rem;
  text-align: center;
}

.footer-bottom p {
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .site-footer {
    padding: 2.5rem 1.5rem 0;
  }
}

@media (min-width: 992px) {
  .site-footer {
    padding-inline: 2.25rem;
  }

  .footer-heading {
    margin-bottom: 1.25rem;
  }

  .footer-bottom {
    text-align: right;
    padding: 1.1rem 2.25rem;
  }
}
</style>
