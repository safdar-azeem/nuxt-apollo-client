import { execSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const main = async () => {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    const peerDeps = packageJson.peerDependencies || {}
    const resolutions = packageJson.resolutions || {}

    // Install resolutions first
    for (const [dep, version] of Object.entries(resolutions)) {
      console.log(`Enforcing resolution: ${dep}@${version}`)
      try {
        execSync(`npm install ${dep}@${version} --save-dev --legacy-peer-deps`, {
          stdio: 'inherit',
        })
      } catch (error) {
        console.warn(
          `Warning: Failed to install resolution ${dep}@${version}. Continuing with installation.`
        )
      }
    }

    // Then install peer dependencies
    for (const [dep, version] of Object.entries(peerDeps)) {
      try {
        await import(dep)
        console.log(`Peer dependency ${dep} is already installed.`)
      } catch (e) {
        console.log(`Installing peer dependency: ${dep}@${version}`)
        try {
          execSync(`npm install ${dep}@${version} --save-dev --legacy-peer-deps`, {
            stdio: 'inherit',
          })
        } catch (error) {
          console.warn(
            `Warning: Failed to install peer dependency ${dep}@${version}. Continuing with installation.`
          )
        }
      }
    }
  } catch (error) {
    console.error('Error during dependency installation:', error)
    process.exit(1)
  }
}

main()
