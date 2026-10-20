<script setup>
const STEPS = [
  {
    title: 'Эспрессо',
    text: 'Двойной шот фирменной обжарки. Пролив — 25 секунд, пока сверху держится плотная ореховая крема.'
  },
  {
    title: 'Молоко',
    text: 'Цельное молоко из холодильника, 4 °C. Наливается до эспрессо, чтобы вкус раскрывался слоями.'
  },
  {
    title: 'Лёд',
    text: 'Крупные кубики из фильтрованной воды. Тают медленно и не разбавляют напиток до последнего глотка.'
  }
]
</script>

<template>
  <section class="craft" id="craft">
    <h2 class="craft-statement" data-split>Три ингредиента.<br>Ничего лишнего.</h2>
    <p class="craft-lede" data-fade>Мы не прячем кофе за сиропами. Айс Латте — это честный вкус
      эспрессо, смягчённый холодным молоком. Готовится за 40 секунд, в строгом порядке.</p>
    <ol class="craft-steps" data-stagger>
      <li v-for="(step, i) in STEPS" :key="step.title" class="craft-step">
        <span class="craft-step-num">{{ i + 1 }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>
