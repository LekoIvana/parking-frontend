<template>
  <v-container class="fill-height" fluid>
    <!-- Animirani background -->
    <div class="animated-background">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="floating-circle circle-4"></div>
    </div>
    
    <v-row
      align="center"
      justify="center"
      class="pa-12 position-relative"
      style="min-height: 100vh;"
    >
      <v-col cols="12" md="8" lg="6" class="text-center">
        <!-- Glavna kartica s glassmorphism efektom -->
        <div class="main-card">
          <!-- Logo s hover efektom -->
          <div class="logo-container">
            <v-img
              src="@/assets/parking-logo2.png"
              max-width="550"
              class="mx-auto logo-image"
              alt="Logo"
              cover
            />
          </div>
          
          <!-- Moderna tipografija -->
          <div class="hero-text">
            <p class="subtitle">
              Broj slobodnih parkirnih mjesta u stvarnom vremenu
            </p>
            <div class="status-indicator">
              <div class="pulse-dot"></div>
              <span class="status-text">Uživo</span>
            </div>
          </div>
          
          <!-- Moderna dugmad -->
          <div class="buttons-container">
            <v-btn
              to="/register"
              class="modern-btn primary-btn"
              size="x-large"
              block
              elevation="0"
            >
              <v-icon left class="mr-2">mdi-account-plus</v-icon>
              Registracija
            </v-btn>
            
            <v-btn
              to="/login"
              class="modern-btn secondary-btn"
              size="x-large"
              block
              elevation="0"
              variant="outlined"
            >
              <v-icon left class="mr-2">mdi-login</v-icon>
              Prijava
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Animirani background */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #004aad 0%, #ffffff 50%, #00d1ff 100%);
  z-index: -1;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 120px;
  height: 120px;
  top: 70%;
  right: 10%;
  animation-delay: -2s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: -4s;
}

.circle-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: -1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Glavna kartica */
.main-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 60px 40px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 25px 50px rgba(0, 74, 173, 0.15);
  transition: all 0.3s ease;
}

.main-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 70px rgba(0, 74, 173, 0.2);
}

/* Logo */
.logo-container {
  margin-bottom: 40px;
}

.logo-image {
  transition: transform 0.3s ease;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.logo-image:hover {
  transform: scale(1.05);
}

/* Tipografija */
.hero-text {
  margin-bottom: 50px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #004aad;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 74, 173, 0.3);
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  color: #004aad;
  font-weight: 600;
  margin-bottom: 25px;
  line-height: 1.6;
  opacity: 0.9;
}

/* Status indikator */
.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: #00d1ff;
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 0 rgba(0, 209, 255, 0.7);
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 209, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 209, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 209, 255, 0);
  }
}

.status-text {
  color: #00d1ff;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Buttons */
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.modern-btn {
  border-radius: 50px !important;
  height: 70px !important;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.primary-btn {
  background: linear-gradient(45deg, #004aad, #00d1ff) !important;
  color: white !important;
  border: none !important;
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 209, 255, 0.4) !important;
}

.primary-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.primary-btn:hover:before {
  left: 100%;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.6) !important;
  color: #004aad !important;
  border: 2px solid #004aad !important;
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.8) !important;
  border-color: #00d1ff !important;
  box-shadow: 0 15px 35px rgba(0, 74, 173, 0.2) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .main-card {
    padding: 40px 30px;
    margin: 20px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .modern-btn {
    height: 60px !important;
    font-size: 1.1rem !important;
  }
}

@media (max-width: 480px) {
  .main-card {
    padding: 30px 20px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>