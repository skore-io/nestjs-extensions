import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import { compileFromFile } from 'json-schema-to-typescript'

const inputDirectory = path.join(__dirname, '../../data-schemas/schemas')
const outputDirectory = path.join(__dirname, '../interface/')

const generateInterfaceScript = async (): Promise<void> => {
  try {
    const schemas = fs.readdirSync(inputDirectory)

    for (const schema of schemas) {
      const filePath = path.join(inputDirectory, schema)
      const compiledInterface = await compileFromFile(filePath, {
        cwd: inputDirectory,
        additionalProperties: false,
        declareExternallyReferenced: false,
        bannerComment: '',
        style: {
          printWidth: 100,
          singleQuote: true,
          semi: false,
          trailingComma: 'all',
        },
      })

      const typescriptFilename = schema.replace(/\.json$/, '.d.ts')
      const interfaceFilePath = path.join(outputDirectory, typescriptFilename)

      fs.writeFileSync(interfaceFilePath, compiledInterface)

      // Remove generated export blocks except the first one if there is more than one block
      if (countExportBlocks(compiledInterface) > 1) {
        removeGeneratedExports(interfaceFilePath)
      }

      addImportStatements(interfaceFilePath)
    }

    writeExports()
  } catch (error) {
    throw Error(`Error on generating interfaces: ${error}`)
  }
}

const writeExports = (): void => {
  const files = fs.readdirSync(outputDirectory)

  const indexFileContent = files
    .filter((file) => file !== 'index.ts')
    .map((file) => `export * from './${file.replace(/\.ts$/, '')}'`)
    .join('\n')

  // Add a blank line to the end to remove eslint error: Insert `⏎`
  const finalContent = `${indexFileContent}\n`

  fs.writeFileSync(path.join(outputDirectory, 'index.ts'), finalContent)
}

const countExportBlocks = (fileContent: string): number => {
  // Counts the number of export blocks generated
  const exportBlocks = fileContent.match(/export type .*?{[^}]*}/gs)
  return exportBlocks ? exportBlocks.length : 0
}

const addImportStatements = (filePath: string): void => {
  let fileContent = fs.readFileSync(filePath, 'utf-8')

  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true)
  const typeNames = []

  const visitNode = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.TypeReference) {
      const typeReferenceNode = node as ts.TypeReferenceNode
      if (
        typeReferenceNode.typeName &&
        typeReferenceNode.typeName.kind === ts.SyntaxKind.Identifier
      ) {
        typeNames.push((typeReferenceNode.typeName as ts.Identifier).text)
      }
    }

    ts.forEachChild(node, visitNode)
  }

  visitNode(sourceFile)

  if (typeNames.length) {
    const importStatement = `import { ${typeNames.join(', ')} } from './'\n\n`
    fileContent = importStatement + fileContent

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent, 'utf8')
  }
}

const removeGeneratedExports = (filePath: string): void => {
  try {
    let fileContent = fs.readFileSync(filePath, 'utf-8')

    // Separates the export blocks
    const exportBlocks = fileContent.match(/export type .*?{[^}]*}/gs)

    // Keep only the first export block if there is more than one block
    fileContent =
      exportBlocks && exportBlocks.length > 1
        ? `${exportBlocks[0]}\n`
        : exportBlocks && exportBlocks.length === 1
        ? `${exportBlocks[0]}\n`
        : ''

    fs.writeFileSync(filePath, fileContent, 'utf-8')
  } catch (error) {
    throw Error(`Error removing export blocks generated in ${filePath}: ${error}`)
  }
}

generateInterfaceScript()
