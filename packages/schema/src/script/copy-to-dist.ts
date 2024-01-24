import * as fs from 'fs'
import * as path from 'path'

const sourceDirectory = 'src/interface'
const destinationDirectory = 'dist/src/interface'

// Copy .d.ts files
const files = fs.readdirSync(sourceDirectory).filter((file) => file.endsWith('.d.ts'))

files.forEach((file) => {
  const sourcePath = path.join(sourceDirectory, file)
  const destinationPath = path.join(destinationDirectory, file)
  fs.copyFileSync(sourcePath, destinationPath)
})
