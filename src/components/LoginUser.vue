<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Prijava</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-icon="mdi-email"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Lozinka"
              type="password"
              prepend-icon="mdi-lock"
              required
            ></v-text-field>
            <v-btn color="primary" @click="login" block>
              Prijavi se
            </v-btn>
            <div v-if="error" class="mt-2 red--text">{{ error }}</div>
            <div v-if="success" class="mt-2 green--text">{{ success }}</div>
            <div class="mt-4">
              <router-link to="/register">Nemate račun? Registrirajte se.</router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

const login = async () => {
  error.value = ''
  success.value = ''
  if (!email.value || !password.value) {
    error.value = 'Unesite email i lozinku'
    return
  }
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    success.value = 'Uspješna prijava! Preusmjeravanje...'
    // Ako želiš automatski preusmjeriti na drugu rutu (npr. dashboard), koristi:
    // window.location.href = '/dashboard'
    // ili router.push('/dashboard') ako koristiš Vue Router
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      error.value = 'Korisnik ne postoji.'
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Pogrešna lozinka.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Unesite ispravan email.'
    } else {
      error.value = err.message
    }
  }
}
</script>
