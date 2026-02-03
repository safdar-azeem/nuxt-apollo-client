import fs from 'fs'
import path from 'path'
import type { ModuleOptions } from '../module'
import { generate } from '@graphql-codegen/cli'
import { getMutation } from './templates/mutation'
import { getSSRQuery } from './templates/ssrQuery'
import { getLazyQuery } from './templates/lazyQuery'
import { getMultiQuery } from './templates/multiQuery'
import { getSmartQuery } from './templates/smartQuery'
import { writeFileWithRetry } from './utils/fileUtils'
import { getCommonTypes } from './templates/commonTypes'
import { applyReplacements } from './utils/replaceConfig'

let isGenerating = false

const processGeneratedFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return

  const originalContent = fs.readFileSync(filePath, 'utf8')
  let content = originalContent

  content = applyReplacements(content)
  content = content.replaceAll('', '')

  if (content.includes('import * as VueApolloComposable')) {
    const injectedCode = `
      ${getCommonTypes()}
      ${getSSRQuery()}
      ${getSmartQuery()}
      ${getLazyQuery()}
      ${getMultiQuery()}
      ${getMutation()}
    `

    content = content.replace(
      "import * as VueApolloComposable from '@vue/apollo-composable';",
      injectedCode
    )
  }

  if (content.trim() !== originalContent.trim()) {
    writeFileWithRetry(filePath, content)
    console.log('\x1b[32m✔\x1b[0m GraphQL operations completed')
  }
}

const runCodegen = async (options: ModuleOptions, targetPath: string, generatedPath: string) => {
  if (isGenerating) return
  isGenerating = true

  const schema = Object.values(options.endPoints)
  const documents = [
    `${targetPath}/**/*.ts`,
    `${targetPath}/**/*.graphql`,
    `!${generatedPath}/**/*`,
  ]

  try {
    await generate(
      {
        schema,
        documents,
        generates: {
          [`${generatedPath}/index.ts`]: {
            plugins: [
              'typescript',
              'typescript-operations',
              'typescript-vue-apollo',
              ...(options.plugins || []),
            ],
            config: {
              typesPrefix: options.prefix,
              skipTypename: true,
              useTypeImports: true,
              dedupeOperationSuffix: true,
              operationResultSuffix: 'Result',
              vueCompositionApiImportFrom: 'vue',
              flattenGeneratedTypesIncludeFragments: true,
              ...options.pluginConfig,
            },
          },
        },
        silent: true,
      },
      true
    )

    processGeneratedFile(path.join(generatedPath, 'index.ts'))
  } catch (error) {
    console.error('🔴 [Apollo] Codegen failed:', error?.message)
  } finally {
    isGenerating = false
  }
}

export const enableCodegen = (options: ModuleOptions, nuxt: any, resolve: any) => {
  const rootDir = nuxt.options.rootDir
  const gqlDir = options.gqlDir || 'graphql'
  const targetPath = path.resolve(rootDir, gqlDir)
  const generatedPath = path.resolve(targetPath, 'generated')

  if (nuxt.options.dev || options.runOnBuild) {
    nuxt.hook('build:before', async () => {
      await runCodegen(options, targetPath, generatedPath)
    })
  }

  if (nuxt.options.dev && options.enableWatcher) {
    nuxt.hook('builder:watch', async (event: string, relativePath: string) => {
      if (relativePath.includes(`${gqlDir}/generated`)) return

      if (relativePath.endsWith('.ts') || relativePath.endsWith('.graphql')) {
        await runCodegen(options, targetPath, generatedPath)
      }
    })
  }
}
