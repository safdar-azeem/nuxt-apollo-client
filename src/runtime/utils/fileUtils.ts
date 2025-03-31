import fs from 'fs'

export const writeFileWithRetry = (filePath, content, retries = 3) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    if (error.code === 'EPIPE' && retries > 0) {
      setTimeout(() => {
        writeFileWithRetry(filePath, content, retries - 1)
      }, 100)
    } else {
      console.error(`Failed to write file ${filePath}:`, error)
    }
  }
}
