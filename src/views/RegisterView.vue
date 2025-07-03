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
      <v-col cols="12" sm="10" md="6" lg="5">
        <!-- Glavna kartica s glassmorphism efektom -->
        <div class="main-card">
          <!-- Naslov -->
          <div class="form-header">
            <h1 class="form-title">
              Registracija
            </h1>
            <p class="form-subtitle">
              Kreirajte svoj nalog za pristup sistemu
            </p>
          </div>
          
          <!-- Forma -->
          <div class="form-content">
            <v-text-field
              v-model="email"
              label="Email adresa"
              type="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              class="modern-input"
              color="#004aad"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="password"
              label="Lozinka"
              type="password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              class="modern-input"
              color="#004aad"
              required
            ></v-text-field>
            
            <v-btn
              color="#004aad"
              @click="register"
              class="modern-btn primary-btn"
              size="x-large"
              block
              elevation="0"
              :loading="loading"
            >
              <v-icon left class="mr-2">mdi-account-plus</v-icon>
              Registriraj se
            </v-btn>
            
            <!-- Error i Success poruke -->
            <div v-if="error" class="mt-4 error-message">
              <v-icon class="mr-2">mdi-alert-circle</v-icon>
              {{ error }}
            </div>
            <div v-if="success" class="mt-4 success-message">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              {{ success }}
            </div>
            
            <!-- Link za povratak -->
            <div class="back-link">
              <v-btn
                to="/"
                variant="text"
                class="back-btn"
                prepend-icon="mdi-arrow-left"
              >
                Nazad na početnu
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const register = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  
  if (!email.value || !password.value) {
    error.value = 'Unesite email i lozinku'
    loading.value = false
    return
  }
  
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    success.value = 'Registracija uspješna! Prijavite se.'
    email.value = ''
    password.value = ''
  } catch (err) {
    // Ljepši prikaz greške za najčešće slučajeve:
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'Taj email je već registriran.'
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Lozinka treba imati barem 6 znakova.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Unesite ispravan email.'
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}
</script>

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
  padding: 50px 40px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 25px 50px rgba(0, 74, 173, 0.15);
  transition: all 0.3s ease;
}

.main-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 70px rgba(0, 74, 173, 0.2);
}

/* Header */
.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #004aad;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 74, 173, 0.3);
}

.form-subtitle {
  font-size: 1.1rem;
  color: #004aad;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 0;
}

/* Form content */
.form-content {
  margin-top: 20px;
}

/* Modern inputs */
.modern-input {
  margin-bottom: 20px;
}

.modern-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.6) !important;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
}

.modern-input :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 25px rgba(0, 74, 173, 0.15);
}

.modern-input :deep(.v-field-outline) {
  border-color: rgba(0, 74, 173, 0.3) !important;
}

.modern-input :deep(.v-field-outline--focused) {
  border-color: #004aad !important;
  border-width: 2px !important;
}

.modern-input :deep(.v-label) {
  color: #004aad !important;
  font-weight: 500 !important;
}

.modern-input :deep(.v-input__prepend-inner) {
  color: #004aad !important;
}

/* Button */
.modern-btn {
  border-radius: 50px !important;
  height: 60px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
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

/* Error i Success poruke */
.error-message {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #d32f2f;
  font-weight: 500;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.success-message {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #388e3c;
  font-weight: 500;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

/* Back link */
.back-link {
  text-align: center;
  margin-top: 30px;
}

.back-btn {
  color: #004aad !important;
  font-weight: 500 !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
}

.back-btn:hover {
  color: #00d1ff !important;
  transform: translateX(-3px);
}

/* Responsive */
@media (max-width: 768px) {
  .main-card {
    padding: 40px 30px;
    margin: 20px;
  }
  
  .form-title {
    font-size: 2rem;
  }
  
  .form-subtitle {
    font-size: 1rem;
  }
  
  .modern-btn {
    height: 55px !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .main-card {
    padding: 30px 20px;
  }
  
  .form-title {
    font-size: 1.8rem;
  }
}
</style>