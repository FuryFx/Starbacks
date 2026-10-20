/* Вырезает плоский фон у photos/2.avif флуд-заливкой от краёв,
   обрезает прозрачные поля и сохраняет public/img/bean-roast-art.png */
import sharp from 'sharp'

const SRC = 'photos/2.avif'
const OUT = 'public/img/bean-roast-art.png'
const TOLERANCE = 42 // евклидово расстояние по RGB

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width: W, height: H } = info
const px = (x, y) => (y * W + x) * 4

// Цвет фона — медиана цветов углов
const corners = [px(0, 0), px(W - 1, 0), px(0, H - 1), px(W - 1, H - 1)]
const bg = [0, 1, 2].map((c) => {
  const vals = corners.map((i) => data[i + c]).sort((a, b) => a - b)
  return (vals[1] + vals[2]) / 2
})

const isBg = (i) => {
  const dr = data[i] - bg[0]
  const dg = data[i + 1] - bg[1]
  const db = data[i + 2] - bg[2]
  return dr * dr + dg * dg + db * db <= TOLERANCE * TOLERANCE
}

// BFS от всех краевых пикселей
const visited = new Uint8Array(W * H)
const queue = []
for (let x = 0; x < W; x++) { queue.push([x, 0], [x, H - 1]) }
for (let y = 0; y < H; y++) { queue.push([0, y], [W - 1, y]) }

while (queue.length) {
  const [x, y] = queue.pop()
  if (x < 0 || y < 0 || x >= W || y >= H) continue
  const flat = y * W + x
  if (visited[flat]) continue
  visited[flat] = 1
  const i = flat * 4
  if (!isBg(i)) continue
  data[i + 3] = 0
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
}

// Мягкое перо по границе: полупрозрачность для пикселей фона рядом с вырезом
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    const i = px(x, y)
    if (data[i + 3] === 0) continue
    const nearCut =
      data[px(x + 1, y) + 3] === 0 || data[px(x - 1, y) + 3] === 0 ||
      data[px(x, y + 1) + 3] === 0 || data[px(x, y - 1) + 3] === 0
    if (nearCut && isBg(i)) data[i + 3] = 120
  }
}

// Прозрачные поля долой
let minX = W, minY = H, maxX = 0, maxY = 0
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[px(x, y) + 3] > 8) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}
const pad = 6
minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad)
maxX = Math.min(W - 1, maxX + pad); maxY = Math.min(H - 1, maxY + pad)

await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .png({ compressionLevel: 9 })
  .toFile(OUT)

console.log(`ok: ${OUT} ${maxX - minX + 1}x${maxY - minY + 1}, bg rgb(${bg.join(',')})`)
