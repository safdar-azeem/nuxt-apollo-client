import { execSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getPackageManager = async () => {
  const rootDir = path.join(__dirname, '..')
  if (
    await fs
      .access(path.join(rootDir, 'bun.lockb'))
      .then(() => true)
      .catch(() => false)
  ) {
    return 'bun'
  } else if (
    await fs
      .access(path.join(rootDir, 'package-lock.json'))
      .then(() => true)
      .catch(() => false)
  ) {
    return 'npm'
  } else if (
    await fs
      .access(path.join(rootDir, 'pnpm-lock.yaml'))
      .then(() => true)
      .catch(() => false)
  ) {
    return 'pnpm'
  } else {
    return 'yarn'
  }
}

const installDependency = async (packageManager, dep, version, isDev = false) => {
  const commands = {
    yarn: `yarn add ${isDev ? '--dev' : ''} ${dep}@${version} --ignore-engines`,
    npm: `npm install ${isDev ? '--save-dev' : ''} ${dep}@${version} --legacy-peer-deps`,
    pnpm: `pnpm add ${isDev ? '-D' : ''} ${dep}@${version} --ignore-peer-deps`,
    bun: `bun add ${isDev ? '-d' : ''} ${dep}@${version}`,
  }
  console.log(commands[packageManager])
  try {
    console.log(`Installing ${dep}@${version}...`)
    execSync(commands[packageManager], { stdio: 'inherit' })
    console.log(`Successfully installed ${dep}@${version}`)
    return true
  } catch (error) {
    console.error(`Error installing ${dep}@${version}:`, error.message)
    return false
  }
}

const main = async () => {
  try {
    const packageManager = await getPackageManager()

    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

    const peerDeps = packageJson.peerDependencies || {}
    for (const [dep, version] of Object.entries(peerDeps)) {
      try {
        await import(dep)
      } catch (e) {
        console.log(`Installing peer dependency: ${dep}@${version}`)
        const success = await installDependency(packageManager, dep, version, true)
        if (!success) {
          console.error(`Failed to install ${dep}@${version}. Please install it manually.`)
        }
      }
    }
  } catch (error) {
    console.error('Error during dependency installation:', error)
    process.exit(1)
  }
}

main()
