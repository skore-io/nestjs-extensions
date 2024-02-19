/* eslint-disable no-console */
import * as fs from 'fs'
import * as path from 'path'

const sourceDirectory = 'src/interface'
const destinationDirectory = 'dist/src/interface'

const directories = fs
  .readdirSync(sourceDirectory)
  .map((dir) => path.join(sourceDirectory, dir))
  .filter((dir) => fs.statSync(dir).isDirectory())

for (const directory of directories) {
  console.info(`Copying files from directory=${directory} to dist`)

  // Copy .d.ts files
  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.d.ts'))

  files.forEach((file) => {
    const sourcePath = path.join(directory, file)
    const destinationPath = path.join(`${destinationDirectory}/${directory.split('/').pop()}`, file)

    fs.copyFileSync(sourcePath, destinationPath)
  })
}
