const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const assetsDir = path.join(__dirname, '..', 'public', 'assets')
const maxSize = 800
const quality = 75

const largeFiles = [
  'photo-intern-bytedance.jpg',
  'photo-hobby-rainforest.jpg',
  'ip-character.png',
  'ip-character-transparent.png',
  'photo-personal-1.jpg',
  'photo-personal-3.jpg',
  'photo-intern-meituan.jpg',
  'photo-intern-xiaomi.jpg',
  'photo-hobby-cave.jpg',
  'photo-personal-2.jpg',
  'ip-three-view.png',
  'photo-intern-kuaishou.jpg',
  'ip-three-view-transparent.png',
]

async function compress() {
  for (const file of largeFiles) {
    const filePath = path.join(assetsDir, file)
    if (!fs.existsSync(filePath)) {
      console.log('SKIP: ' + file + ' not found')
      continue
    }

    const before = fs.statSync(filePath).size
    const ext = path.extname(file)
    const tempFile = filePath + '.tmp'

    try {
      let img = sharp(filePath).rotate()
      const meta = await img.metadata()

      if (meta.width > maxSize || meta.height > maxSize) {
        img = img.resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true })
      }

      if (ext === '.png') {
        await img.png({ quality, compressionLevel: 9 }).toFile(tempFile)
      } else {
        await img.jpeg({ quality, mozjpeg: true }).toFile(tempFile)
      }

      const after = fs.statSync(tempFile).size
      if (after < before) {
        fs.unlinkSync(filePath)
        fs.renameSync(tempFile, filePath)
        console.log('OK: ' + file + ' ' + Math.round(before / 1024) + 'KB -> ' + Math.round(after / 1024) + 'KB')
      } else {
        console.log('SKIP: ' + file + ' already optimized')
        fs.unlinkSync(tempFile)
      }
    } catch (err) {
      console.error('ERR: ' + file + ' - ' + err.message)
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile)
    }
  }
  console.log('Done!')
}

compress()
