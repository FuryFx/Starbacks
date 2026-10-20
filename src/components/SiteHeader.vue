<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const NAV_LINKS = [
  { href: '#drink', label: 'Напиток' },
  { href: '#craft', label: 'Рецепт' },
  { href: '#beans', label: 'Зёрна' },
  { href: '#menu', label: 'Меню' }
]

const scrolled = ref(false)
const menuOpen = ref(false)

const onScroll = () => { scrolled.value = window.scrollY > 10 }

const onKeydown = (e) => {
  if (e.key === 'Escape') menuOpen.value = false
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <nav class="nav" aria-label="Основная навигация">
      <a class="nav-logo" href="#top" aria-label="Starbucks — на главную">
        <img src="/img/logo.svg" alt="Логотип Starbucks" width="40" height="40">
      </a>
      <ul class="nav-links">
        <li v-for="link in NAV_LINKS" :key="link.href">
          <a :href="link.href">{{ link.label }}</a>
        </li>
      </ul>
      <a class="nav-cta" href="#menu">Заказать</a>
      <button
        class="nav-burger"
        :class="{ open: menuOpen }"
        :aria-expanded="String(menuOpen)"
        :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>
    </nav>
  </header>

  <div class="mobile-menu" :class="{ open: menuOpen }" :aria-hidden="String(!menuOpen)">
    <ul>
      <li v-for="(link, i) in NAV_LINKS" :key="link.href" :style="{ '--i': i }">
        <a :href="link.href" @click="menuOpen = false">{{ link.label }}</a>
      </li>
    </ul>
    <p class="mobile-menu-note" :style="{ '--i': NAV_LINKS.length }">Лето холодного кофе — 2026</p>
  </div>
</template>
