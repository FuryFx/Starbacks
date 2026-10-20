<script setup>
const STATS = [
  { value: 92, suffix: ' °C', label: 'температура воды' },
  { value: 9, suffix: ' бар', label: 'давление пролива' },
  { value: 25, suffix: ' сек', label: 'идеальный шот' }
]
</script>

<template>
  <section class="espresso" id="craft-espresso">
    <div class="espresso-text">
      <h2 data-split>Двадцать пять секунд<br>до идеального шота</h2>
      <p data-fade>Бариста запускает пролив — и время пошло. Если эспрессо течёт быстрее,
        вкус будет водянистым, медленнее — горьким. Ровно двадцать пять секунд дают плотную
        ореховую крему, которая держит вкус даже на льду.</p>
      <ul class="espresso-stats" data-stagger>
        <li v-for="stat in STATS" :key="stat.label">
          <strong :data-count="stat.value" :data-suffix="stat.suffix">{{ stat.value }}{{ stat.suffix }}</strong>
          <span>{{ stat.label }}</span>
        </li>
      </ul>
    </div>
    <div class="espresso-media" data-img-reveal>
      <img
        src="/img/espresso-pour.jpg"
        alt="Эспрессо льётся из холдера кофемашины в белую чашку"
        width="1200" height="1800" loading="lazy" data-parallax="70"
      >
    </div>
  </section>
</template>
