import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const src = 'src/assets/Modern RoomFinder Map Pin Logo.png'
mkdirSync('public', { recursive: true })

const sizes = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]

for (const [name, size] of sizes) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(`public/${name}`)
  console.log('created public/' + name)
}