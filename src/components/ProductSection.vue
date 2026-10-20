<script setup>
const FACTS = [
  { value: 220, suffix: ' мл', label: 'порция на один раз' },
  { value: 78, suffix: ' мг', label: 'кофеина в порции' },
  { value: 0, suffix: ' г', label: 'добавленного сахара' }
]
</script>

<template>
  <section class="product">
    <div class="product-media" data-img-reveal>
      <img
        src="/img/caffe-latte-size.webp"
        alt="Стакан Starbucks Caffè Latte 220 мл высотой 12 сантиметров на ладони"
        width="320" height="320" loading="lazy"
      >
    </div>
    <div class="product-text">
      <h2 data-split>Латте, который можно взять с собой</h2>
      <p data-fade>Caffè Latte в фирменном стакане — тот же купаж эспрессо и сливочное молоко,
        запечатанные холодными. Открыл, перелил на лёд — и твой айс латте готов где угодно.</p>
      <ul class="product-facts" data-stagger>
        <li v-for="fact in FACTS" :key="fact.label">
          <strong :data-count="fact.value" :data-suffix="fact.suffix">{{ fact.value }}{{ fact.suffix }}</strong>
          <span>{{ fact.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
