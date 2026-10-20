/* Скролл-хореография: GSAP + ScrollTrigger.
   Декларативно через data-атрибуты:
   data-split            — заголовок: пословный masked-reveal
   data-fade             — блок: blur-растворение + подъём
   data-img-reveal       — обёртка картинки: шторка clip-path + усадка масштаба
   data-parallax="60"    — <img> внутри обёртки: параллакс по скроллу (px)
   data-count="92"       — число: count-up (data-suffix=" °C")
   data-stagger          — контейнер: каскад появления детей
*/
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Разбивает элемент на слова, сохраняя <br> и вложенную разметку не трогая */
function splitWords(el) {
  const walk = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        const parts = child.textContent.split(/(\s+)/)
        parts.forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '))
          } else {
            const w = document.createElement('span')
            w.className = 'split-w'
            const wi = document.createElement('span')
            wi.className = 'split-wi'
            wi.textContent = part
            w.appendChild(wi)
            frag.appendChild(w)
          }
        })
        node.replaceChild(frag, child)
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child)
      }
    })
  }
  walk(el)
  return el.querySelectorAll('.split-wi')
}

export function initAnimations() {
  if (reduceMotion()) return

  /* Заголовки: слова поднимаются из-под маски */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = splitWords(el)
    gsap.from(words, {
      yPercent: 115,
      rotate: 2.5,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.065,
      scrollTrigger: { trigger: el, start: 'top 86%' }
    })
  })

  /* Текст: blur-растворение */
  document.querySelectorAll('[data-fade]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 34,
      filter: 'blur(12px)',
      duration: 1.1,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.fade) || 0,
      clearProps: 'filter',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    })
  })

  /* Картинки: шторка снизу + усадка масштаба */
  document.querySelectorAll('[data-img-reveal]').forEach((wrap) => {
    const img = wrap.querySelector('img')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: 'top 82%' }
    })
    tl.fromTo(
      wrap,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'power4.inOut', clearProps: 'clipPath' }
    )
    if (img) {
      tl.from(img, { scale: 1.3, duration: 1.6, ease: 'power3.out' }, 0)
    }
  })

  /* Параллакс картинок внутри обёрток */
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    const amp = parseFloat(img.dataset.parallax) || 50
    gsap.fromTo(
      img,
      { y: -amp },
      {
        y: amp,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('section') || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    )
  })

  /* Count-up чисел */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count)
    const suffix = el.dataset.suffix || ''
    const counter = { v: 0 }
    el.textContent = '0' + suffix
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.v) + suffix }
        })
    })
  })

  /* Каскад детей (карточки, шаги, факты) */
  document.querySelectorAll('[data-stagger]').forEach((box) => {
    gsap.from(box.children, {
      opacity: 0,
      y: 56,
      duration: 0.95,
      ease: 'power3.out',
      stagger: 0.12,
      clearProps: 'all',
      scrollTrigger: { trigger: box, start: 'top 85%' }
    })
  })

  /* Hero: стакан — параллакс с лёгким наклоном, текст — растворение при уходе вверх */
  const heroImg = document.querySelector('.hero-cut')
  if (heroImg) {
    gsap.to(heroImg, {
      y: 120,
      rotate: 3,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    })
  }
  const heroText = document.querySelector('.hero-text')
  if (heroText) {
    gsap.to(heroText, {
      opacity: 0.1,
      y: -70,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true }
    })
  }

  /* Арт-зерно: лёгкий дрейф и наклон по скроллу */
  const beanArt = document.querySelector('.roast-art img')
  if (beanArt) {
    gsap.fromTo(
      beanArt,
      { y: 60, rotate: -5 },
      {
        y: -60,
        rotate: 4,
        ease: 'none',
        scrollTrigger: { trigger: '.roast', start: 'top bottom', end: 'bottom top', scrub: true }
      }
    )
  }

  /* Бегущий заголовок, привязанный к скроллу */
  const ticker = document.querySelector('.ticker-track')
  if (ticker) {
    gsap.fromTo(
      ticker,
      { xPercent: 4 },
      {
        xPercent: -26,
        ease: 'none',
        scrollTrigger: { trigger: '.ticker', start: 'top bottom', end: 'bottom top', scrub: true }
      }
    )
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
}

export function refreshAnimations() {
  if (!reduceMotion()) ScrollTrigger.refresh()
}
