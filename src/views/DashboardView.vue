<template>
  <v-app>
    <!-- NAVBAR -->
    <v-navigation-drawer v-model="drawer" permanent class="left-navbar" width="270">
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
          <template #prepend>
            <v-icon class="nav-icon">mdi-lightbulb</v-icon>
          </template>
          <v-list-item-title class="nav-text">Predikcije</v-list-item-title>
        </v-list-item>
        <v-list-item
          class="nav-item"
          :class="{ active: currentView === 'history' }"
          @click="() => { currentView = 'history'; fetchHistory() }"
        >
          <template #prepend>
            <v-icon class="nav-icon">mdi-history</v-icon>
          </template>
          <v-list-item-title class="nav-text">Povijest</v-list-item-title>
        </v-list-item>
        <v-list-item
          class="nav-item"
          :class="{ active: currentView === 'global' }"
          @click="() => { currentView = 'global'; fetchLastGlobal() }"
        >
          <template #prepend>
            <v-icon class="nav-icon">mdi-earth</v-icon>
          </template>
          <v-list-item-title class="nav-text">Zadnja globalna</v-list-item-title>
        </v-list-item>
        <v-divider class="my-4"></v-divider>
        <v-list-item class="nav-item logout-item" @click="logout">
          <template #prepend>
            <v-icon class="nav-icon">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="nav-text">Odjava</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- BG -->
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
                <div class="header">
                  <h1 class="title">SpotCount</h1>
                  <p class="subtitle">Dodaj sliku i pokreni prepoznavanje slobodnih mjesta</p>
                </div>
                <v-card-text>
                  <!-- Upload zona -->
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

                  <!-- Statistika -->
                  <v-row class="spot-stats-row mt-6" justify="center" align="center"
                    v-if="result !== null && !loading"
                  >
                    <v-col cols="12" sm="4">
                      <v-card class="spot-stat-card free" elevation="2">
                        <v-icon size="36" class="mb-2">mdi-parking</v-icon>
                        <div class="stat-number">{{ result }}</div>
                        <div class="stat-label">Slobodnih</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="spot-stat-card occupied" elevation="2">
                        <v-icon size="36" class="mb-2">mdi-car</v-icon>
                        <div class="stat-number">{{ lastOccupied }}</div>
                        <div class="stat-label">Zauzetih</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="spot-stat-card total" elevation="2">
                        <v-icon size="36" class="mb-2">mdi-counter</v-icon>
                        <div class="stat-number">{{ lastTotal }}</div>
                        <div class="stat-label">Ukupno</div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Annotirana slika -->
                  <div v-if="annotatedUrl && !loading" class="mt-4">
                    <div class="text-center mb-2" style="color: #004aad; font-weight: 600;">
                      Označena slobodna mjesta:
                    </div>
                    <v-img
                      :src="annotatedUrl"
                      max-width="420"
                      class="rounded mx-auto"
                      alt="Označena slobodna mjesta"
                    ></v-img>
                  </div>
                  <div v-if="error" class="mt-4">
                    <v-alert type="error">{{ error }}</v-alert>
                  </div>
                </v-card-text>
              </div>

              <!-- POVIJEST -->
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
                      <v-card class="history-card mb-4" elevation="2" style="position:relative;">
                        <v-btn
                          icon
                          color="error"
                          size="small"
                          class="delete-btn"
                          style="position:absolute;top:12px;right:12px;z-index:2;"
                          @click="deletePrediction(item.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-img
                          :src="item.annotated_image_url"
                          height="220"
                          cover
                          class="history-image"
                        />
                        <v-card-title class="history-title d-flex align-center">
                          <v-icon class="mr-2" color="#44c767">mdi-parking</v-icon>
                          <span class="mr-2">{{ item.n_free ?? '-' }}</span>
                          <span style="font-size: 0.95rem; color: #44c767; margin-right:10px;">Slobodnih</span>
                          <v-icon class="mr-2" color="#e34b4c">mdi-car</v-icon>
                          <span class="mr-2">{{ item.n_occupied ?? '-' }}</span>
                          <span style="font-size: 0.95rem; color: #e34b4c; margin-right:10px;">Zauzetih</span>
                          <v-icon class="mr-2" color="#2874c9">mdi-counter</v-icon>
                          <span>{{ item.total_spots ?? '-' }}</span>
                          <span style="font-size: 0.95rem; color: #2874c9;">Ukupno</span>
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

              <!-- GLOBAL VIEW -->
              <div v-else-if="currentView === 'global'">
                <div class="header">
                  <h1 class="title">
                    <v-icon class="mr-2">mdi-earth</v-icon>
                    Zadnja globalna predikcija
                  </h1>
                  <p class="subtitle">Prikaz posljednje analize iz cijelog sustava</p>
                </div>
                <v-card-text v-if="lastGlobal">
                  <div class="text-center mb-2" style="color: #004aad; font-weight: 600;">
                    Označena slobodna mjesta:
                  </div>
                  <v-img
                    :src="lastGlobal.annotated_image_url"
                    max-width="420"
                    class="rounded mx-auto"
                    alt="Označena slobodna mjesta"
                  ></v-img>
                  <v-row class="spot-stats-row mt-6" justify="center" align="center">
                    <v-col cols="12" sm="4">
                      <v-card class="spot-stat-card free" elevation="2">
                        <v-icon size="36" class="mb-2">mdi-parking</v-icon>
                        <div class="stat-number">{{ lastGlobal.n_free }}</div>
                        <div class="stat-label">Slobodnih</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="spot-stat-card occupied" elevation="2">
                        <v-icon size="36" class="mb-2">mdi-car</v-icon>
                        <div class="stat-number">{{ lastGlobal.n_occupied }}</div>
                        <div class="stat-label">Zauzetih</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="spot-stat-card total" elevation="2">
                        <v-icon size="36" class="mb-2">mdi-counter</v-icon>
                        <div class="stat-number">{{ lastGlobal.total_spots }}</div>
                        <div class="stat-label">Ukupno</div>
                      </v-card>
                    </v-col>
                  </v-row>
                  <div class="text-center mt-2" style="color: #333;">
                    <p>Vrijeme: {{ formatDate(lastGlobal?.created_at) }}</p>

                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div class="text-center py-8">
                    <v-icon size="80" color="#004aad" class="mb-4">mdi-inbox</v-icon>
                    <h3 style="color: #004aad;">Nema globalnih predikcija</h3>
                  </div>
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'
import { db } from '@/firebase'
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore'

const drawer = ref(true)
const currentView = ref('predictions')
const image = ref(null)
const previewUrl = ref('')
const loading = ref(false)
const dragActive = ref(false)
const result = ref(null)
const annotatedUrl = ref(null)
const error = ref('')
const lastOccupied = ref(null)
const lastTotal = ref(null)
const router = useRouter()
const history = ref([])
const lastGlobal = ref(null)

const dropzoneText = computed(() =>
  image.value ? `Odabrana: ${image.value.name}` : 'Povuci sliku ovdje ili klikni'
)

const fetchLastGlobal = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/get_last_global')
    lastGlobal.value = res.data
  } catch { lastGlobal.value = null }
}
onMounted(fetchLastGlobal)

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
  } catch (error) {
    try {
      const q2 = query(
        collection(db, "predictions"),
        where("user_id", "==", user.uid)
      )
      const querySnapshot2 = await getDocs(q2)
      history.value = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error2) {
      history.value = []
    }
  }
}

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file?.type.startsWith('image/')) {
    image.value = file
    const reader = new FileReader()
    reader.onload = (e) => previewUrl.value = e.target.result
    reader.readAsDataURL(file)
    result.value = null
    error.value = ''
    annotatedUrl.value = null
    lastOccupied.value = null
    lastTotal.value = null
  }
}
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
    annotatedUrl.value = null
    lastOccupied.value = null
    lastTotal.value = null
  }
}

const predict = async () => {
  if (!image.value) return
  loading.value = true
  result.value = null
  error.value = ''
  annotatedUrl.value = null
  lastOccupied.value = null
  lastTotal.value = null
  try {
    const user = getAuth().currentUser
    if (!user) {
      error.value = "Niste prijavljeni!"
      return
    }
    const formData = new FormData()
    formData.append('file', image.value)
    formData.append('user_id', user.uid)
    const res = await axios.post('http://127.0.0.1:8000/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    result.value = res.data.n_free
    lastOccupied.value = res.data.n_occupied
    lastTotal.value = res.data.total_spots
    annotatedUrl.value = res.data.annotated_image_url
    await fetchLastGlobal()
    if (currentView.value === 'history') {
      await fetchHistory()
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Greška pri obradi slike.'
  } finally {
    loading.value = false
  }
}

const formatDate = (created_at) => {
  if (!created_at) return "Nepoznat datum";
  // ISO string
  if (typeof created_at === 'string') {
    const d = new Date(created_at);
    if (!isNaN(d)) return d.toLocaleString();
    return created_at; // fallback
  }
  // Firestore timestamp (ako koristiš u povijesti)
  if (created_at.seconds) {
    const d = new Date(created_at.seconds * 1000);
    return d.toLocaleString();
  }
  return "Nepoznat datum";
};


const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}

const deletePrediction = async (id) => {
  if (!id) return
  try {
    await deleteDoc(doc(db, "predictions", id))
    history.value = history.value.filter(item => item.id !== id)
  } catch (e) {
    alert("Greška pri brisanju!")
  }
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
.nav-title { color: white; font-weight: 800; font-size: 1.6rem; letter-spacing: 1px; margin: 0 0 8px 0; }
.nav-subtitle { color: rgba(255, 255, 255, 0.7); font-size: 0.85rem; font-weight: 500; margin: 0; }
.nav-menu { padding: 0 16px; }
.nav-item { border-radius: 12px !important; margin: 6px 0; transition: all 0.3s ease; color: rgba(255, 255, 255, 0.8) !important; }
.nav-item:hover { background: rgba(255, 255, 255, 0.1) !important; color: white !important; transform: translateX(4px); }
.nav-item.active { background: rgba(0, 209, 255, 0.2) !important; color: #00d1ff !important; border-left: 3px solid #00d1ff; }
.nav-icon { color: inherit !important; margin-right: 4px; }
.nav-text { color: inherit !important; font-weight: 600; font-size: 0.95rem; }
.logout-item { color: rgba(255, 255, 255, 0.6) !important; margin-top: 20px; }
.logout-item:hover { background: rgba(255, 86, 86, 0.15) !important; color: #ff5656 !important; }
.animated-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #004aad 0%, #ffffff 50%, #00d1ff 100%); z-index: -1; }
.animated-bg div { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.12); animation: float 6s ease-in-out infinite; }
.circle-1 { width: 80px; height: 80px; top: 10%; left: 10%; }
.circle-2 { width: 120px; height: 120px; top: 70%; right: 10%; animation-delay: -2s; }
.circle-3 { width: 60px; height: 60px; bottom: 20%; left: 20%; animation-delay: -4s; }
.circle-4 { width: 100px; height: 100px; top: 30%; right: 30%; animation-delay: -1s; }
@keyframes float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-20px);} }
.main-card { background: rgba(255,255,255,0.3) !important; backdrop-filter: blur(24px) !important; border: 1px solid rgba(255,255,255,0.5) !important; box-shadow: 0 15px 50px rgba(0,74,173,0.14); }
.header { text-align: center; padding: 22px 0; }
.title { font-size: 2.3rem; font-weight: 800; color: #004aad; }
.subtitle { color: #004aad; opacity: 0.8; font-weight: 500; }
.dropzone { border: 2px dashed #00d1ff; border-radius: 22px; background: rgba(255,255,255,0.4); backdrop-filter: blur(10px); padding: 48px 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; }
.dropzone.active { background: rgba(0,209,255,0.13); border-color: #004aad; transform: scale(1.02); }
.dropzone-icon { color: #00d1ff; animation: bounce 2s infinite; }
@keyframes bounce { 0%,20%,50%,80%,100%{transform:translateY(0);} 40%{transform:translateY(-10px);} }
.dropzone p { color: #004aad; font-weight: 500; margin: 16px 0 0 0; }
.image-preview { background: rgba(255,255,255,0.46) !important; border: 1px solid rgba(0,209,255,0.22) !important; padding: 20px; }
.primary-btn { background: linear-gradient(45deg,#004aad,#00d1ff) !important; color: white !important; border-radius: 50px !important; font-weight: 600 !important; box-shadow: 0 8px 25px rgba(0,74,173,0.13); }
.primary-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(0,209,255,0.24) !important; }
.result-box { text-align: center; font-size: 1.2rem; font-weight: 600; }
.history-card { background: rgba(255,255,255,0.9) !important; border: 1px solid rgba(0,209,255,0.2) !important; transition: all 0.3s ease; }
.history-card:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgba(0,74,173,0.15) !important; }
.history-image { border-radius: 8px 8px 0 0 !important; }
.history-title { color: #004aad !important; font-weight: 600 !important; font-size: 1.1rem !important; }
.history-date { color: #666 !important; font-size: 0.9rem !important; }
@media (max-width: 768px) {
  .left-navbar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .left-navbar.mobile-open { transform: translateX(0); }
  .title { font-size: 1.3rem; }
  .dropzone { padding: 28px 8px; }
}
.spot-stats-row { margin-bottom: 18px; }
.spot-stat-card { text-align: center; border-radius: 18px !important; padding: 18px 0 14px 0; background: rgba(255,255,255,0.82); backdrop-filter: blur(7px); min-width: 120px; max-width: 210px; margin: 0 auto; transition: box-shadow .2s; }
.spot-stat-card .stat-number { font-size: 2.0rem; font-weight: bold; color: inherit; margin-bottom: 2px; }
.spot-stat-card .stat-label { font-size: 1rem; font-weight: 600; opacity: .7; }
.spot-stat-card.free { border-left: 6px solid #44c767; color: #189d3d; }
.spot-stat-card.occupied { border-left: 6px solid #e34b4c; color: #e34b4c; }
.spot-stat-card.total { border-left: 6px solid #3ca6e5; color: #2874c9; }
</style>
