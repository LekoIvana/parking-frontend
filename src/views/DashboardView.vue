<template>
  <v-app>
    <!-- LIJEVI NAVBAR -->
    <v-navigation-drawer
      v-model="drawer"
      permanent
      class="left-navbar"
      width="280"
    >
      <div class="navbar-header">
        <h2 class="nav-title">SpotCount</h2>
        <p class="nav-subtitle">Parking Spot Counter</p>
      </div>

      <v-list class="nav-menu">
        <v-list-item
          class="nav-item"
          :class="{ active: currentView === 'predictions' }"
          @click="currentView = 'predictions'"
        >
          <template v-slot:prepend>
            <v-icon class="nav-icon">mdi-lightbulb</v-icon>
          </template>
          <v-list-item-title class="nav-text">Predikcije</v-list-item-title>
        </v-list-item>

        <v-list-item
          class="nav-item"
          :class="{ active: currentView === 'history' }"
          @click="() => { currentView = 'history'; fetchHistory() }"
        >
          <template v-slot:prepend>
            <v-icon class="nav-icon">mdi-history</v-icon>
          </template>
          <v-list-item-title class="nav-text">Povijest</v-list-item-title>
        </v-list-item>

        <v-divider class="my-4"></v-divider>

        <v-list-item
          class="nav-item logout-item"
          @click="logout"
        >
          <template v-slot:prepend>
            <v-icon class="nav-icon">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="nav-text">Odjava</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Animated background -->
    <div class="animated-bg">
      <div v-for="i in 4" :key="i" :class="`circle-${i}`"></div>
    </div>

    <v-main>
      <v-container class="fill-height">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="main-card">
              
              <!-- PREDIKCIJE VIEW -->
              <div v-if="currentView === 'predictions'">
                <!-- Header -->
                <div class="header">
                  <h1 class="title">SpotCount</h1>
                  <p class="subtitle">Dodaj sliku i pokreni prepoznavanje slobodnih mjesta</p>
                </div>

                <v-card-text>
                  <!-- Upload -->
                  <div
                    class="dropzone"
                    :class="{ active: dragActive }"
                    @click="$refs.fileInput.click()"
                    @dragover.prevent="dragActive = true"
                    @dragleave.prevent="dragActive = false"
                    @drop.prevent="handleDrop"
                  >
                    <v-icon size="48" class="dropzone-icon">mdi-cloud-upload</v-icon>
                    <p>{{ dropzoneText }}</p>
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="handleFile"
                    />
                  </div>

                  <!-- Pregled slike -->
                  <v-card v-if="image" class="image-preview mt-4" elevation="0">
                    <v-img :src="previewUrl" max-width="350" class="rounded mx-auto"></v-img>
                  </v-card>

                  <!-- Gumb za predikciju -->
                  <v-btn
                    :disabled="!image"
                    :loading="loading"
                    class="primary-btn mt-4"
                    block
                    size="large"
                    @click="predict"
                  >
                    <v-icon start>mdi-lightbulb</v-icon>
                    {{ loading ? 'Procesiranje...' : 'Pokreni prepoznavanje' }}
                  </v-btn>

                  <!-- Rezultat predikcije -->
                  <div v-if="result !== null && !loading" class="result-box mt-6">
                    <v-alert type="info" color="#004aad" border="left" elevation="2">
                      Broj slobodnih parkirnih mjesta: <b>{{ result }}</b>
                    </v-alert>
                  </div>
                  <div v-if="error" class="mt-4">
                    <v-alert type="error">{{ error }}</v-alert>
                  </div>

                  <!-- Annotirana slika -->
                  <div v-if="annotatedImage && !loading" class="mt-4">
                    <div class="text-center mb-2" style="color: #004aad; font-weight: 600;">
                      Označena slobodna mjesta:
                    </div>
                    <v-img
                      :src="'data:image/jpeg;base64,' + annotatedImage"
                      max-width="420"
                      class="rounded mx-auto"
                      alt="Označena slobodna mjesta"
                    ></v-img>
                  </div>
                </v-card-text>
              </div>

              <!-- POVIJEST VIEW -->
              <div v-else-if="currentView === 'history'">
                <div class="header">
                  <h1 class="title">
                    <v-icon class="mr-2">mdi-history</v-icon>
                    Povijest predikcija
                  </h1>
                  <p class="subtitle">Vaše prethodne analize parkirnih mjesta</p>
                </div>

                <v-card-text>
                  <div v-if="history.length === 0" class="text-center py-8">
                    <v-icon size="80" color="#004aad" class="mb-4">mdi-inbox</v-icon>
                    <h3 style="color: #004aad; margin-bottom: 16px;">Još nema spremljenih predikcija</h3>
                    <p style="color: #666;">Dodajte sliku i pokrenite prepoznavanje da vidite rezultate ovdje.</p>
                  </div>
                  
                  <v-row v-else>
                    <v-col
                      v-for="(item, i) in history"
                      :key="i"
                      cols="12"
                      md="6"
                      lg="4"
                    >
                      <v-card class="history-card mb-4" elevation="2">
                        <v-img 
                          :src="item.image_url" 
                          height="200" 
                          cover 
                          class="history-image"
                        />
                        <v-card-title class="history-title">
                          <v-icon class="mr-2" color="#004aad">mdi-car</v-icon>
                          {{ item.n_free }} {{ item.n_free === 1 ? 'slobodno mjesto' : 'slobodnih mjesta' }}
                        </v-card-title>
                        <v-card-subtitle class="history-date">
                          {{ item.created_at && item.created_at.toDate 
                            ? item.created_at.toDate().toLocaleString() 
                            : (item.created_at?.seconds ? formatTimestamp(item.created_at) : 'Nepoznat datum') }}
                        </v-card-subtitle>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </div>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'
import { supabase } from '@/supabase'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore'

const drawer = ref(true)
const currentView = ref('predictions')
const image = ref(null)
const previewUrl = ref('')
const loading = ref(false)
const dragActive = ref(false)
const result = ref(null)
const error = ref('')
const annotatedImage = ref(null)
const router = useRouter()
const history = ref([])

const dropzoneText = computed(() =>
  image.value ? `Odabrana: ${image.value.name}` : 'Povuci sliku ovdje ili klikni'
)

// Upload slike na Supabase Storage
const uploadImage = async (file, userId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}_${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from('predictions')
    .upload(fileName, file)
  if (error) throw error

  // Dohvati javni URL slike (ISPRAVNO!)
  const { data } = supabase.storage
    .from('predictions')
    .getPublicUrl(fileName)
  // console.log('Supabase public URL:', data?.publicUrl)
  return data.publicUrl
}

// Spremi predikciju u Firestore
const savePrediction = async (imageUrl, nFree) => {
  const user = getAuth().currentUser
  if (!user) throw new Error("Nema korisnika!")

  await addDoc(collection(db, "predictions"), {
    user_id: user.uid,
    image_url: imageUrl,
    n_free: nFree,
    created_at: serverTimestamp()
  })
}

// Prikaz povijesti iz Firestore
const fetchHistory = async () => {
  const user = getAuth().currentUser
  if (!user) return

  try {
    const q = query(
      collection(db, "predictions"),
      where("user_id", "==", user.uid),
      orderBy("created_at", "desc")
    )
    const querySnapshot = await getDocs(q)
    history.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Povijest:', history.value)
  } catch (error) {
    // Ako orderBy padne, pokušaj fallback bez orderBy:
    try {
      const q2 = query(
        collection(db, "predictions"),
        where("user_id", "==", user.uid)
      )
      const querySnapshot2 = await getDocs(q2)
      history.value = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('Povijest fallback:', history.value)
    } catch (error2) {
      console.error('Greška fallback povijest:', error2)
      history.value = []
    }
  }
}


// Odabir slike
const handleFile = (e) => {
  const file = e.target.files[0]
  if (file?.type.startsWith('image/')) {
    image.value = file
    const reader = new FileReader()
    reader.onload = (e) => previewUrl.value = e.target.result
    reader.readAsDataURL(file)
    result.value = null
    error.value = ''
    annotatedImage.value = null
  }
}

// Drag&drop
const handleDrop = (e) => {
  dragActive.value = false
  const file = e.dataTransfer.files[0]
  if (file?.type.startsWith('image/')) {
    image.value = file
    const reader = new FileReader()
    reader.onload = (e) => previewUrl.value = e.target.result
    reader.readAsDataURL(file)
    result.value = null
    error.value = ''
    annotatedImage.value = null
  }
}

// Glavna predikcija (backend -> Supabase -> Firestore)
const predict = async () => {
  if (!image.value) return

  loading.value = true
  result.value = null
  error.value = ''
  annotatedImage.value = null

  try {
    const formData = new FormData()
    formData.append('file', image.value)

    // 1. Pošalji sliku backendu za predikciju
    const res = await axios.post('http://127.0.0.1:8000/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    result.value = res.data.n_free
    annotatedImage.value = res.data.image_base64

    // 2. Upload originalne slike na Supabase storage
    const user = getAuth().currentUser
    const imageUrl = await uploadImage(image.value, user.uid)

    // 3. Spremi sve u Firestore
    await savePrediction(imageUrl, res.data.n_free)
    
    // 4. Osvježi povijest ako je prikazana
    if (currentView.value === 'history') {
      await fetchHistory()
    }

  } catch (err) {
    error.value = err.response?.data?.detail || 'Greška pri obradi slike.'
  } finally {
    loading.value = false
  }
}

// Formatiranje Firestore timestamp-a (ako nije .toDate funkcija)
const formatTimestamp = (ts) => {
  if (!ts?.seconds) return ""
  const d = new Date(ts.seconds * 1000)
  return d.toLocaleString()
}

// Odjava korisnika
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}
</script>

<style scoped>
.left-navbar {
  background: linear-gradient(180deg, #004aad 0%, #0056d1 100%) !important;
  border-right: none !important;
  box-shadow: 4px 0 20px rgba(0, 74, 173, 0.15);
}

.navbar-header {
  padding: 32px 24px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.nav-title {
  color: white;
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: 1px;
  margin: 0 0 8px 0;
}

.nav-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
}

.nav-menu {
  padding: 0 16px;
}

.nav-item {
  border-radius: 12px !important;
  margin: 6px 0;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8) !important;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(0, 209, 255, 0.2) !important;
  color: #00d1ff !important;
  border-left: 3px solid #00d1ff;
}

.nav-icon {
  color: inherit !important;
  margin-right: 4px;
}

.nav-text {
  color: inherit !important;
  font-weight: 600;
  font-size: 0.95rem;
}

.logout-item {
  color: rgba(255, 255, 255, 0.6) !important;
  margin-top: 20px;
}

.logout-item:hover {
  background: rgba(255, 86, 86, 0.15) !important;
  color: #ff5656 !important;
}

.animated-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #004aad 0%, #ffffff 50%, #00d1ff 100%);
  z-index: -1;
}

.animated-bg div {
  position: absolute; border-radius: 50%; background: rgba(255,255,255,0.12);
  animation: float 6s ease-in-out infinite;
}

.circle-1 { width: 80px; height: 80px; top: 10%; left: 10%; }
.circle-2 { width: 120px; height: 120px; top: 70%; right: 10%; animation-delay: -2s; }
.circle-3 { width: 60px; height: 60px; bottom: 20%; left: 20%; animation-delay: -4s; }
.circle-4 { width: 100px; height: 100px; top: 30%; right: 30%; animation-delay: -1s; }

@keyframes float {
  0%,100%{transform:translateY(0px);}
  50%{transform:translateY(-20px);}
}

.main-card {
  background: rgba(255,255,255,0.3) !important;
  backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255,255,255,0.5) !important;
  box-shadow: 0 15px 50px rgba(0,74,173,0.14);
}

.header { text-align: center; padding: 22px 0; }
.title { font-size: 2.3rem; font-weight: 800; color: #004aad; }
.subtitle { color: #004aad; opacity: 0.8; font-weight: 500; }

.dropzone {
  border: 2px dashed #00d1ff; border-radius: 22px;
  background: rgba(255,255,255,0.4); backdrop-filter: blur(10px);
  padding: 48px 20px; text-align: center; cursor: pointer;
  transition: all 0.3s ease;
}

.dropzone.active {
  background: rgba(0,209,255,0.13); border-color: #004aad; transform: scale(1.02);
}

.dropzone-icon { color: #00d1ff; animation: bounce 2s infinite; }

@keyframes bounce {
  0%,20%,50%,80%,100%{transform:translateY(0);}
  40%{transform:translateY(-10px);}
}

.dropzone p { color: #004aad; font-weight: 500; margin: 16px 0 0 0; }

.image-preview {
  background: rgba(255,255,255,0.46) !important;
  border: 1px solid rgba(0,209,255,0.22) !important;
  padding: 20px;
}

.primary-btn {
  background: linear-gradient(45deg,#004aad,#00d1ff) !important;
  color: white !important; border-radius: 50px !important; font-weight: 600 !important;
  box-shadow: 0 8px 25px rgba(0,74,173,0.13);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0,209,255,0.24) !important;
}

.result-box {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.history-card {
  background: rgba(255,255,255,0.9) !important;
  border: 1px solid rgba(0,209,255,0.2) !important;
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0,74,173,0.15) !important;
}

.history-image {
  border-radius: 8px 8px 0 0 !important;
}

.history-title {
  color: #004aad !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
}

.history-date {
  color: #666 !important;
  font-size: 0.9rem !important;
}

@media (max-width: 768px) {
  .left-navbar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .left-navbar.mobile-open {
    transform: translateX(0);
  }
  
  .title { font-size: 1.3rem; }
  .dropzone { padding: 28px 8px; }
}
</style>
