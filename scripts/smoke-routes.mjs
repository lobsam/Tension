import { spawn } from 'node:child_process'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'

const host = process.env.SMOKE_HOST ?? '127.0.0.1'
const port = Number(process.env.SMOKE_PORT ?? 4173)
const baseUrl = `http://${host}:${port}`
const routes = ['/', '/articles', '/articles/1', '/art']

const preview = spawn('npm', ['run', 'preview', '--', '--host', host, '--port', String(port), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env
})

let previewOutput = ''

preview.stdout.on('data', (chunk) => {
  const text = chunk.toString()
  previewOutput += text
  process.stdout.write(text)
})

preview.stderr.on('data', (chunk) => {
  const text = chunk.toString()
  previewOutput += text
  process.stderr.write(text)
})

const stopPreview = () => {
  if (preview.exitCode === null) {
    preview.kill('SIGTERM')
  }
}

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (preview.exitCode !== null) {
      throw new Error('Preview server exited before smoke checks could run.')
    }

    try {
      const response = await fetch(baseUrl, { redirect: 'manual' })
      if (response.status >= 200 && response.status < 500) {
        return
      }
    } catch {
      // Retry until the preview server is available.
    }

    await sleep(250)
  }

  throw new Error(`Preview server did not become ready at ${baseUrl}.`)
}

const checkRoute = async (routePath) => {
  const response = await fetch(`${baseUrl}${routePath}`, { redirect: 'manual' })

  if (!response.ok) {
    throw new Error(`Route ${routePath} returned ${response.status}.`)
  }

  const html = await response.text()
  if (!html.includes('<div id="app"></div>') && !html.includes('<div id="app">')) {
    throw new Error(`Route ${routePath} did not render the app shell.`)
  }

  console.log(`smoke ok: ${routePath}`)
}

try {
  await waitForServer()
  for (const routePath of routes) {
    await checkRoute(routePath)
  }
} catch (error) {
  console.error('Route smoke validation failed.')
  if (previewOutput) {
    console.error(previewOutput)
  }
  console.error(error)
  process.exitCode = 1
} finally {
  stopPreview()
  await sleep(200)
  if (preview.exitCode === null) {
    preview.kill('SIGKILL')
  }
}
