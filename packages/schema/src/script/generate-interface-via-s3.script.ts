import AWS from 'aws-sdk'
import * as fs from 'fs'
import * as path from 'path'
import { compile } from 'json-schema-to-typescript'
import { ObjectList } from 'aws-sdk/clients/s3'

const s3 = new AWS.S3()
const bucketName = 'learningrocks-schemas'

const generateInterfaceScript = async (): Promise<void> => {
  try {
    const contents = await getBucketContents()

    for (const content of contents) {
      if (!content.Size) continue

      const jsonSchema = await getContentData(content)
      const compiledInterface = await compile(jsonSchema, content.Key, {
        declareExternallyReferenced: false,
      })

      writeFile(content, compiledInterface)
    }

    writeExports()
  } catch (error) {
    throw new Error('Error on generating interfaces')
  }
}

const getBucketContents = async (): Promise<ObjectList> => {
  const folderPath = 'events'

  const listObjectsParams = {
    Bucket: bucketName,
    Prefix: folderPath,
  }

  const { Contents } = await s3.listObjectsV2(listObjectsParams).promise()
  return Contents
}

const getContentData = async (content: Object): Promise<object> => {
  const getObjectParams = {
    Bucket: bucketName,
    Key: content['Key'],
  }

  const objectData = await s3.getObject(getObjectParams).promise()
  const contentString = objectData.Body.toString('utf-8')
  return JSON.parse(contentString)
}

const writeFile = (content: Object, compiledInterface: string): void => {
  const { name, dir } = path.parse(content['Key'])
  const interfaceDirectory = path.join(__dirname, `../interface/${dir}`)

  const filePath = path.join(interfaceDirectory, `${name}.d.ts`)

  fs.writeFileSync(filePath, compiledInterface)
}

const writeExports = () => {
  const folders = fs.readdirSync(path.join(__dirname, `../interface`))

  for (const folder of folders) {
    if (/\./.test(folder)) continue

    const dir = fs.readdirSync(path.join(path.join(__dirname, `../interface`), folder))

    const indexFileContent = dir
      .filter((file) => file.endsWith('.ts'))
      .map((file) => `export * from './${file}'`)
      .join('\n')

    const indexPath = path.join(path.join(path.join(__dirname, `../interface`), folder), 'index.ts')
    fs.writeFileSync(indexPath, indexFileContent)
  }
}

generateInterfaceScript()
