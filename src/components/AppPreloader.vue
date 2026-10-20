<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['done'])

const ASSETS = [
  '/img/iced-latte-cutout.webp',
  '/img/caffe-latte-cup.jpg',
  '/img/coffee-beans-sm.jpg',
  '/img/caffe-latte-size.webp',
  '/img/mocha-trio.jpg',
  '/img/espresso-pour.jpg',
  '/img/oat-caramel-macchiato.webp',
  '/img/bean-roast-art.png',
  '/img/logo.svg'
]

const NOTES = [
  'Завариваем эспрессо…',
  'Вспениваем молоко…',
  'Добавляем лёд…',
  'Почти готово'
]

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const MIN_DURATION = reduceMotion ? 300 : 2200

const progress = ref(0)
const note = ref(NOTES[0])
const noteSwapping = ref(false)
const curtain = ref(false)
const removed = ref(false)

const pct = computed(() => Math.round(progress.value))
const fillClip = computed(() => `inset(${100 - pct.value}% 0 0 0)`)

onMounted(() => {
  const startTime = performance.now()
  let loadedCount = 0
  let displayed = 0
  let finished = false

  ASSETS.forEach((src) => {
    const img = new Image()
    img.onload = img.onerror = () => { loadedCount++ }
    img.src = src
  })

  let noteIndex = 0
  const noteTimer = setInterval(() => {
    noteIndex = Math.min(noteIndex + 1, NOTES.length - 1)
    noteSwapping.value = true
    setTimeout(() => {
      note.value = NOTES[noteIndex]
      noteSwapping.value = false
    }, 300)
    if (noteIndex === NOTES.length - 1) clearInterval(noteTimer)
  }, MIN_DURATION / NOTES.length)

  const finish = () => {
    if (finished) return
    finished = true
    progress.value = 100
    clearInterval(noteTimer)
    setTimeout(() => {
      curtain.value = true
      emit('done')
      setTimeout(() => { removed.value = true }, 1100)
    }, 450)
  }

  const tick = (now) => {
    const elapsed = now - startTime
    const timeProgress = Math.min(elapsed / MIN_DURATION, 1) * 100
    const loadProgress = (loadedCount / ASSETS.length) * 100
    const target = Math.min(timeProgress, loadProgress)

    displayed += (target - displayed) * 0.08
    if (target >= 100 && displayed > 99.2) displayed = 100

    progress.value = displayed

    if (displayed >= 100) {
      finish()
    } else {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)

  // Страховка: если загрузка зависла, снимаем прелоудер через 8 секунд
  setTimeout(finish, 8000)
})
</script>

<template>
  <div v-if="!removed" class="preloader" :class="{ done: curtain }" aria-hidden="true">
    <div class="pre-inner">
      <div class="pre-logo">
        <img class="pre-logo-base" src="/img/logo.svg" alt="" width="120" height="120">
        <img class="pre-logo-fill" src="/img/logo.svg" alt="" width="120" height="120" :style="{ clipPath: fillClip }">
      </div>
      <div class="pre-count">
        <span>{{ pct }}</span><span class="pre-pct">%</span>
      </div>
      <div class="pre-bar"><span :style="{ width: pct + '%' }"></span></div>
      <p class="pre-note" :class="{ swap: noteSwapping }">{{ note }}</p>
    </div>
  </div>
</template>
