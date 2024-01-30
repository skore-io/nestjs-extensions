import * as fs from 'fs'
import * as path from 'path'
import { compile } from 'json-schema-to-typescript'

const inputDirectory = path.join(__dirname, '../../data-schemas/schemas')
const outputDirectory = path.join(__dirname, '../interface/')

const generateInterfaceScript = async (): Promise<void> => {
  try {
    const schemas = fs.readdirSync(inputDirectory)

    for (const schema of schemas) {
      const filePath = path.join(inputDirectory, schema)

      const json = modifyJsonSchema(filePath)

      const compiledInterface = await compile(json, null, {
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
    }

    writeExports()
  } catch (error) {
    throw Error(`Error on generating interfaces: ${error}`)
  }
}

const modifyJsonSchema = (filePath: string): JSON => {
  try {
    const schema = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    if (schema.properties) {
      // Creates a new "attributes" field based on existing fields
      schema.properties.attributes = {
        type: 'object',
        properties: {},
        required: [],
      }

      // Creates a new "body" field based on existing fields
      schema.properties.body = {
        type: 'object',
        properties: {},
        required: [],
      }

      // Moves "element_action", "element_type", "source" and created_at fields to "attributes"
      if (schema.properties.element_action) {
        schema.properties.attributes.properties.action = schema.properties.element_action
        schema.properties.attributes.required.push('action')
        delete schema.properties.element_action
      }

      if (schema.properties.element_type) {
        schema.properties.attributes.properties.type = schema.properties.element_type
        schema.properties.attributes.required.push('type')
        delete schema.properties.element_type
      }

      if (schema.properties.created_at) {
        schema.properties.attributes.properties.created_at = schema.properties.created_at
        schema.properties.attributes.required.push('created_at')
        delete schema.properties.created_at
      }

      if (schema.properties.meta.properties.source) {
        schema.properties.attributes.properties.source = schema.properties.meta.properties.source
        schema.properties.attributes.required.push('source')
        delete schema.properties.meta.properties.source
      }

      if (schema.properties.meta && schema.properties.meta.properties) {
        // Move properties inside meta to root level
        Object.assign(schema.properties, schema.properties.meta.properties)
        delete schema.properties.meta
      }

      // Move other fields to "body"
      Object.keys(schema.properties).forEach((key) => {
        if (key !== 'attributes' && key !== 'body') {
          schema.properties.body.properties[key] = schema.properties[key]
          schema.properties.body.required.push(key)
          delete schema.properties[key]
        }
      })
    }

    return schema
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error modifying JSON schema: ${error}`)
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

generateInterfaceScript()
