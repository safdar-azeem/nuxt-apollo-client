import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import ts from 'typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sourceFilePath = path.resolve(__dirname, '../src/runtime/codegen.ts')
const distFilePath = path.resolve(__dirname, '../dist/runtime/codegen.js')
const graphqlFilePath = path.resolve(__dirname, '../src/runtime/composables/graphql.ts')

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8')

const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf8')

const transpileTS = (content) => {
  const result = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  })
  return result.outputText
}

const main = () => {
  console.log('Starting build process...')

  const originalContent = readFile(sourceFilePath)
  const graphqlOriginalContent = readFile(graphqlFilePath)

  const simplifiedContent = `export const addCodegenPlugin = (_options, nuxt, resolve) => {};`

  writeFile(sourceFilePath, simplifiedContent)
  writeFile(graphqlFilePath, 'export const anyRandomQuery = () => {}')

  console.log('Simplified codegen.ts for build process')

  console.log('Running build command...')
  try {
    execSync('nuxt-module-build build', { stdio: 'inherit' })
  } catch (error) {
    console.error('Build failed:', error)

    writeFile(sourceFilePath, originalContent)
    writeFile(graphqlFilePath, graphqlOriginalContent)
    process.exit(1)
  }

  const transpiledContent = transpileTS(originalContent)

  writeFile(distFilePath, transpiledContent)
  console.log('Added transpiled code to dist/runtime/codegen.js')

  writeFile(sourceFilePath, originalContent)
  writeFile(graphqlFilePath, graphqlOriginalContent)
  console.log('Restored original content of src/runtime/codegen.ts')

  console.log('Build process completed successfully!')
}

main()

const copyInstallPeerDepsScript = () => {
  const sourcePath = path.resolve(__dirname, 'install-peer-deps.js')
  const destPath = path.resolve(__dirname, '../dist/install-peer-deps.js')
  fs.copyFileSync(sourcePath, destPath)
  console.log('Copied install-peer-deps.js to dist folder')
}

copyInstallPeerDepsScript()
