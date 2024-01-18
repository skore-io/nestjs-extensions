import * as fs from 'fs'
import * as path from 'path'
import { compileFromFile } from 'json-schema-to-typescript'

const generateInterfaceScript = async (): Promise<void> => {
  try {
    const dir = path.join(__dirname, '../../data-schemas/schemas')
    const schemas = fs.readdirSync(path.join(__dirname, '../../data-schemas/schemas'))

    for (const schema of schemas) {
      const compiledInterface = await compileFromFile(path.join(dir, schema), {
        cwd: dir,
        declareExternallyReferenced: false,
        ignoreMinAndMaxItems: true,
      })
      writeFile(schema, compiledInterface)
    }

    writeExports()
  } catch (error) {
    throw new Error('Error on generating interfaces')
  }
}

const writeFile = (name: string, compiledInterface: string): void => {
  const typescriptFilename = name.replace(/\.json$/, '.d.ts')
  const interfaceDirectory = path.join(__dirname, '../interface/')

  const filePath = path.join(interfaceDirectory, typescriptFilename)

  fs.writeFileSync(filePath, compiledInterface)
}

const writeExports = (): void => {
  const dir = path.join(__dirname, `../interface`)
  const files = fs.readdirSync(dir)

  const indexFileContent = files
    .filter((file) => file !== 'index.ts')
    .map((file) => `export * from './${file.replace(/\.ts$/, '')}'`)
    .join('\n')

  fs.writeFileSync(path.join(dir, 'index.ts'), indexFileContent)
}

generateInterfaceScript()
