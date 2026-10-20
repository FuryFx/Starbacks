<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import AppPreloader from './components/AppPreloader.vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import CraftSection from './components/CraftSection.vue'
import RoastSection from './components/RoastSection.vue'
import ProductSection from './components/ProductSection.vue'
import EspressoSection from './components/EspressoSection.vue'
import TickerBand from './components/TickerBand.vue'
import MenuSection from './components/MenuSection.vue'
import CtaSection from './components/CtaSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { initAnimations, refreshAnimations } from './animations'

const loaded = ref(false)

document.body.classList.add('is-loading')

watch(loaded, (value) => {
  document.body.classList.toggle('is-loading', !value)
  document.body.classList.toggle('loaded', value)
  // после ухода шторки прелоудера пересчитываем позиции скролл-триггеров
  setTimeout(refreshAnimations, 1200)
})

onMounted(async () => {
  await nextTick()
  initAnimations()
})
</script>

<template>
  <AppPreloader @done="loaded = true" />

  <SiteHeader />

  <main id="top">
    <HeroSection />
    <CraftSection />
    <RoastSection />
    <ProductSection />
    <EspressoSection />
    <TickerBand />
    <MenuSection />
    <CtaSection />
  </main>

  <SiteFooter />
</template>
