<script setup>
import { reactive } from 'vue'

/* Чтобы добавить напиток: положи фото в public/img и добавь объект сюда. */
const ITEMS = reactive([
  {
    id: 'caffe-latte',
    title: 'Каффе Латте',
    desc: 'Готовый Caffè Latte в фирменном стакане — для дороги.',
    price: 320,
    img: '/img/caffe-latte-cup.jpg',
    alt: 'Caffè Latte в стакане с сиреной Starbucks',
    cover: false,
    added: false
  },
  {
    id: 'oat-macchiato',
    title: 'Оат Карамель Макиато',
    desc: 'Эспрессо на овсяном молоке с карамельным оттенком. Веган.',
    price: 350,
    img: '/img/oat-caramel-macchiato.webp',
    alt: 'Starbucks Oat Caramel Macchiato на овсяном молоке',
    cover: false,
    added: false
  },
  {
    id: 'mocha',
    title: 'Мокко',
    desc: 'Эспрессо с какао и молочной пеной. Подаём горячим.',
    price: 410,
    img: '/img/mocha-trio.jpg',
    alt: 'Три чашки мокко с какао, шоколадом и мятой',
    cover: false,
    added: false
  }
])

function addItem(item) {
  item.added = true
  setTimeout(() => { item.added = false }, 1400)
}
</script>

<template>
  <section class="menu" id="menu">
    <h2 data-split>Выбери свой латте</h2>
    <p class="menu-lede" data-fade>Одна основа — три характера. Все напитки готовим на двойном эспрессо.</p>
    <div class="menu-grid" data-stagger>
      <article v-for="item in ITEMS" :key="item.id" class="menu-card">
        <div class="menu-card-img" :class="{ 'menu-card-img--light': !item.cover }">
          <img :src="item.img" :alt="item.alt" loading="lazy">
        </div>
        <div class="menu-card-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <div class="menu-card-row">
            <span class="menu-price">{{ item.price }} ₽</span>
            <button
              class="menu-add"
              type="button"
              :disabled="item.added"
              :aria-label="`Добавить ${item.title}`"
              @click="addItem(item)"
            >{{ item.added ? '✓' : '+' }}</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
