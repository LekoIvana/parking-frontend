<template>
  <v-app>
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <v-avatar size="56" class="sidebar-avatar">
            <v-icon size="36" color="#00d1ff">mdi-brain</v-icon>
          </v-avatar>
          <div class="sidebar-title">Prediktor</div>
        </div>
        <div class="sidebar-links">
          <v-btn
            class="nav-link"
            :class="{ active: currentTab === 'dashboard' }"
            block
            variant="text"
            @click="currentTab = 'dashboard'"
          >
            <v-icon left>mdi-upload</v-icon>
            <span>Početna</span>
          </v-btn>
          <v-btn
            class="nav-link"
            :class="{ active: currentTab === 'history' }"
            block
            variant="text"
            @click="currentTab = 'history'"
          >
            <v-icon left>mdi-history</v-icon>
            <span>Prijašnje predikcije</span>
          </v-btn>
        </div>
        <div class="sidebar-footer">
          <v-tooltip location="right">
            <template #activator="{ props }">
              <v-btn v-bind="props" class="info-btn" icon @click="openInfo = true">
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </template>
            <span>Kontakt & Info</span>
          </v-tooltip>
          <v-btn class="logout-btn" icon @click="logout">
            <v-icon color="#d32f2f">mdi-logout</v-icon>
          </v-btn>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <!-- Animirani background -->
        <div class="animated-background">
          <div class="floating-circle circle-1"></div>
          <div class="floating-circle circle-2"></div>
          <div class="floating-circle circle-3"></div>
          <div class="floating-circle circle-4"></div>
        </div>
        <div class="main-inner">
          <!-- Početna -->
          <div v-if="currentTab === 'dashboard'" class="main-card">
            <div class="dashboard-header">
              <h1 class="dashboard-title">Dashboard</h1>
              <p class="dashboard-subtitle">
                Dobrodošao! Dodaj sliku i pokreni predikciju.
              </p>
            </div>
            <!-- DRAG & DROP / UPLOAD -->
            <div
              class="dropzone"
              :class="{ 'dropzone--active': isDragActive }"
              @dragover.prevent="isDragActive = true"
              @dragleave.prevent="isDragActive = false"
              @drop.prevent="onDrop"
              @click="$refs.fileInput.click()"
            >
              <v-icon size="40" color="#00d1ff">mdi-cloud-upload</v-icon>
              <p v-if="!imageName">Povuci i ispusti sliku ovdje, ili klikni za upload</p>
              <p v-else>Odabrana datoteka: <b>{{ imageName }}</b></p>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="file-input"
                @change="onFileChange"
              />
            </div>
            <!-- Preview slike -->
            <div v-if="imageUrl" class="image-preview mt-4">
              <img :src="imageUrl" alt="Preview slike" />
            </div>
            <!-- Gumb za predikciju -->
            <v-btn
              class="modern-btn primary-btn mt-6"
              size="x-large"
              block
              elevation="0"
              @click="onPredict"
            >
              <v-icon left class="mr-2">mdi-lightbulb</v-icon>
              Pokreni predikciju
            </v-btn>
          </div>
          <!-- Prijašnje predikcije -->
          <div v-if="currentTab === 'history'" class="main-card">
            <div class="dashboard-header">
              <h1 class="dashboard-title">Prijašnje predikcije</h1>
              <p class="dashboard-subtitle">
                Ovdje će biti lista tvojih ranijih predikcija.
              </p>
            </div>
            <div class="history-placeholder">
              <v-icon color="#004aad" size="48" class="mb-2">mdi-file-find</v-icon>
              <div>Još nema pohranjenih predikcija.</div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Info Modal -->
    <v-dialog v-model="openInfo" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left class="mr-2">mdi-information-outline</v-icon>
          Kontakt & Info
        </v-card-title>
        <v-card-text>
          <div>
            <b>Aplikacija Prediktor</b> <br>
            Autor: Marko Leko <br>
            Kontakt: <a href="mailto:marko@email.com">marko@email.com</a>
          </div>
          <div class="mt-4" style="font-size:0.97em;">
            Napomena: Ova aplikacija je demonstracijska i nema medicinsku primjenu.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="#004aad" @click="openInfo = false">Zatvori</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const currentTab = ref('dashboard')
const imageUrl = ref('')
const imageName = ref('')
const isDragActive = ref(false)
const openInfo = ref(false)
const router = useRouter()

const onDrop = (event) => {
  isDragActive.value = false
  const files = event.dataTransfer.files
  handleFile(files && files[0])
}

const onFileChange = (e) => {
  const file = e.target.files && e.target.files[0]
  handleFile(file)
}

function handleFile(file) {
  if (file && file.type.startsWith('image/')) {
    imageName.value = file.name
    const reader = new FileReader()
    reader.onload = e => { imageUrl.value = e.target.result }
    reader.readAsDataURL(file)
  } else {
    imageName.value = ''
    imageUrl.value = ''
  }
}

const onPredict = () => {
  alert('Predikcija pokrenuta! (placeholder)')
}

const logout = () => {
  // Dodaj ovdje svoj signOut ako koristiš Firebase (npr. await signOut(auth))
  router.push('/login')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  background: none;
}

.sidebar {
  width: 220px;
  background: rgba(255,255,255,0.37);
  backdrop-filter: blur(22px);
  border-right: 1.5px solid rgba(0,74,173,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: 30px 0 20px 0;
  z-index: 2;
  box-shadow: 6px 0 22px 0 rgba(0,74,173,0.08);
  min-height: 100vh;
}
.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
}
.sidebar-avatar {
  background: linear-gradient(135deg,#00d1ff10 10%,#004aad14 90%);
  margin-bottom: 8px;
}
.sidebar-title {
  font-weight: 900;
  color: #004aad;
  font-size: 1.15rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 6px rgba(0,74,173,0.12);
  margin-bottom: 8px;
}
.sidebar-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 12px;
  padding: 0 18px;
}
.nav-link {
  justify-content: flex-start !important;
  color: #004aad !important;
  font-weight: 600 !important;
  border-radius: 15px !important;
  margin: 0 0 2px 0;
  font-size: 1.05rem !important;
  transition: background 0.18s, color 0.17s;
  height: 50px;
  align-items: center;
}
.nav-link .v-icon { margin-right: 13px !important; }
.nav-link.active, .nav-link:hover {
  background: linear-gradient(90deg,#004aad17,#00d1ff15) !important;
  color: #00d1ff !important;
}

.sidebar-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 14px;
  align-items: center;
  padding: 14px 0 0 0;
  border-top: 1.1px solid rgba(0,74,173,0.10);
}
.info-btn {
  background: rgba(0,209,255,0.15) !important;
  color: #00d1ff !important;
}
.logout-btn {
  background: rgba(244,67,54,0.12) !important;
}
.logout-btn .v-icon { color: #d32f2f !important; }

.main-content {
  flex: 1;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  background: none;
}
.animated-background {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: linear-gradient(135deg,#004aad 0%,#fff 50%,#00d1ff 100%);
  z-index: -1;
  overflow: hidden;
}
.floating-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.15); animation: float 6s ease-in-out infinite;}
.circle-1 { width: 80px;  height: 80px;  top: 10%;  left: 10%; animation-delay: 0s;}
.circle-2 { width: 120px; height: 120px; top: 70%;  right: 10%; animation-delay: -2s;}
.circle-3 { width: 60px;  height: 60px;  bottom: 20%; left: 20%; animation-delay: -4s;}
.circle-4 { width: 100px; height: 100px; top: 30%;  right: 30%; animation-delay: -1s;}
@keyframes float { 0%,100% {transform:translateY(0) rotate(0deg);} 50% {transform:translateY(-20px) rotate(180deg);} }
.main-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0 0 0;
  min-height: 100vh;
  width: 100%;
}
.main-card {
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 52px 46px;
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 25px 50px rgba(0,74,173,0.13);
  min-width: 340px;
  max-width: 500px;
  width: 100%;
  margin-bottom: 60px;
  transition: all 0.3s;
}
.main-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 35px 70px rgba(0,74,173,0.17);
}
.dashboard-header { text-align: center; margin-bottom: 40px; }
.dashboard-title { font-size: 2.1rem; font-weight: 800; color: #004aad; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,74,173,0.2);}
.dashboard-subtitle { font-size: 1.07rem; color: #004aad; font-weight: 500; opacity: 0.85; margin-bottom: 0;}
.dropzone {
  border: 2px dashed #00d1ff;
  border-radius: 18px;
  background: rgba(255,255,255,0.46);
  padding: 36px 20px 24px 20px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 18px;
  transition: background 0.3s, border-color 0.3s;
  position: relative;
}
.dropzone--active {
  background: rgba(0,209,255,0.10);
  border-color: #004aad;
}
.dropzone .v-icon { margin-bottom: 10px; }
.dropzone p { margin: 0; color: #004aad; font-weight: 500; }
.file-input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0; top: 0;
  cursor: pointer;
}
.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.33);
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(0,209,255,0.11);
}
.image-preview img {
  max-width: 180px;
  max-height: 180px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,74,173,0.13);
}
.modern-btn {
  border-radius: 50px !important;
  height: 60px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}
.primary-btn {
  background: linear-gradient(45deg,#004aad,#00d1ff) !important;
  color: white !important;
  border: none !important;
}
.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0,209,255,0.32) !important;
}
.primary-btn:before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
  transition: left 0.5s;
}
.primary-btn:hover:before { left: 100%; }
.history-placeholder {
  text-align: center;
  padding: 46px 0;
  color: #004aad;
  opacity: 0.7;
  font-size: 1.11rem;
}
@media (max-width: 900px) {
  .sidebar { width: 60px; min-width: 60px; }
  .sidebar-title, .nav-link span { display: none; }
  .sidebar-links { padding: 0 4px; }
}
@media (max-width: 700px) {
  .sidebar { display: none; }
  .main-inner { padding-top: 20px;}
  .main-card { padding: 22px 8px;}
}
</style>
