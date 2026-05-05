import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'

const host = process.env.SMOKE_HOST ?? '127.0.0.1'
const port = Number(process.env.SMOKE_PORT ?? 4173)
const baseUrl = `http://${host}:${port}`

const routes = [
  { path: '/', label: 'home' },
  { path: '/articles', label: 'articles' },
  { path: '/articles/1', label: 'article-detail' },
  { path: '/art', label: 'art' }
]

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
]

const preview = spawn(
  'npm',
  ['run', 'preview', '--', '--host', host, '--port', String(port), '--strictPort'],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env
  }
)

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
      throw new Error('Preview server exited before responsive smoke checks could run.')
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

const loadChromium = async () => {
  try {
    const playwright = await import('playwright')
    return playwright.chromium
  } catch (error) {
    throw new Error(
      `Playwright is required for responsive smoke checks. Install it with "npm install -D playwright". Original error: ${error.message}`
    )
  }
}

const evaluatePage = async (page) =>
  page.evaluate(() => {
    const root = document.documentElement
    const app = document.querySelector('#app')
    const nav = document.querySelector('header nav, nav, .navbar, header')
    const interactiveElements = Array.from(
      document.querySelectorAll('a, button, [role="button"], input, select, textarea')
    )

    const isVisible = (element) => {
      if (!(element instanceof HTMLElement)) {
        return false
      }
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        Number(style.opacity) !== 0
      )
    }

    return {
      hasHorizontalOverflow: root.scrollWidth - root.clientWidth > 1,
      hasRenderableContent: Boolean(app?.textContent?.trim().length),
      navVisible: nav ? isVisible(nav) : false,
      visibleInteractiveCount: interactiveElements.filter((element) => isVisible(element)).length
    }
  })

const runChecks = async () => {
  const chromium = await loadChromium()
  const browser = await chromium.launch({ headless: true })
  const results = []

  try {
    for (const route of routes) {
      for (const viewport of viewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        })
        const page = await context.newPage()
        const check = {
          route: route.path,
          routeLabel: route.label,
          viewport: viewport.name,
          width: viewport.width,
          height: viewport.height,
          pass: true,
          issues: [],
          metrics: null
        }

        try {
          await page.goto(`${baseUrl}${route.path}`, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
          })
          await page.waitForTimeout(800)

          const metrics = await evaluatePage(page)
          check.metrics = metrics

          if (metrics.hasHorizontalOverflow) {
            check.pass = false
            check.issues.push('horizontal-overflow')
          }
          if (!metrics.hasRenderableContent) {
            check.pass = false
            check.issues.push('no-rendered-content')
          }
          if (!metrics.navVisible) {
            check.pass = false
            check.issues.push('navigation-not-visible')
          }
          if (metrics.visibleInteractiveCount === 0) {
            check.pass = false
            check.issues.push('no-visible-interactive-elements')
          }
        } catch (error) {
          check.pass = false
          check.issues.push(`runtime-error:${error.message}`)
        } finally {
          await context.close()
        }

        const status = check.pass ? 'PASS' : 'FAIL'
        const issueSummary = check.issues.length ? ` (${check.issues.join(', ')})` : ''
        console.log(`${status} ${route.path} @ ${viewport.name}${issueSummary}`)
        results.push(check)
      }
    }
  } finally {
    await browser.close()
  }

  return results
}

const writeReport = async (results) => {
  const reportDir = new URL('../qa/reports/', import.meta.url)
  await mkdir(reportDir, { recursive: true })

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    routes: routes.map((route) => route.path),
    viewports,
    totalChecks: results.length,
    passedChecks: results.filter((item) => item.pass).length,
    failedChecks: results.filter((item) => !item.pass).length,
    results
  }

  await writeFile(new URL('./responsive-smoke.latest.json', reportDir), JSON.stringify(summary, null, 2))
  return summary
}

try {
  await waitForServer()
  const results = await runChecks()
  const summary = await writeReport(results)

  if (summary.failedChecks > 0) {
    console.error(
      `Responsive smoke validation failed: ${summary.failedChecks}/${summary.totalChecks} checks failed.`
    )
    process.exitCode = 1
  } else {
    console.log(`Responsive smoke validation passed: ${summary.passedChecks}/${summary.totalChecks} checks.`)
  }
} catch (error) {
  console.error('Responsive smoke validation failed.')
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
