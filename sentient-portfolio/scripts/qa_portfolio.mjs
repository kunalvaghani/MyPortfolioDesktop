import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { request } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifactsDir = path.join(root, 'qa-artifacts');
const userDataDir = path.join(root, `.qa-chrome-${Date.now()}`);
const port = Number(process.env.PORTFOLIO_DEBUG_PORT || 9300 + Math.floor(Math.random() * 500));
const baseUrl = (process.env.PORTFOLIO_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

const viewports = [
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 1 },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 1 },
  { name: 'desktop', width: 1440, height: 1000, deviceScaleFactor: 1 },
];

const failures = [];
const consoleErrors = [];
const requestFailures = [];
const screenshots = [];
let activeViewport = 'startup';

function fail(message) {
  failures.push(`[${activeViewport}] ${message}`);
}

function resolveBrowserPath() {
  const explicit = process.env.BROWSER_PATH;
  const candidates = [
    explicit,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
  ].filter(Boolean);

  const absolute = candidates.find((candidate) => existsSync(candidate));
  if (absolute) return absolute;

  const commandNames = process.platform === 'win32'
    ? ['chrome.exe', 'msedge.exe']
    : ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge'];

  for (const command of commandNames) {
    try {
      const resolver = process.platform === 'win32' ? 'where.exe' : 'which';
      const result = execFileSync(resolver, [command], { encoding: 'utf8' }).trim().split(/\r?\n/)[0];
      if (result) return result;
    } catch {
      // Try the next known browser command.
    }
  }

  throw new Error('No Chrome or Edge executable found. Set BROWSER_PATH to a Chromium browser.');
}

function httpJson(targetUrl) {
  return new Promise((resolve, reject) => {
    const req = request(targetUrl, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => req.destroy(new Error(`Timed out requesting ${targetUrl}`)));
    req.end();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChrome() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const targets = await httpJson(`http://127.0.0.1:${port}/json/list`);
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      // Chromium may still be starting.
    }
    await delay(250);
  }
  throw new Error('Chromium did not expose a page DevTools target.');
}

function cdpConnect(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl);
  const callbacks = new Map();
  let id = 0;

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && callbacks.has(message.id)) {
      const callback = callbacks.get(message.id);
      callbacks.delete(message.id);
      if (message.error) callback.reject(new Error(message.error.message));
      else callback.resolve(message.result);
      return;
    }

    if (message.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(`[${activeViewport}] ${message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text}`);
    }

    if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) {
      const text = message.params.args.map((arg) => arg.value || arg.description || '').join(' ');
      consoleErrors.push(`[${activeViewport}] ${text}`);
    }

    if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params.entry.level)) {
      consoleErrors.push(`[${activeViewport}] ${message.params.entry.text}`);
    }

    if (message.method === 'Network.loadingFailed' && !message.params.canceled) {
      requestFailures.push(`[${activeViewport}] ${message.params.errorText}`);
    }
  });

  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => resolve({
      send(method, params = {}) {
        id += 1;
        ws.send(JSON.stringify({ id, method, params }));
        return new Promise((cmdResolve, cmdReject) => callbacks.set(id, { resolve: cmdResolve, reject: cmdReject }));
      },
      close() { ws.close(); },
    }));
    ws.addEventListener('error', reject);
  });
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result?.value;
}

async function waitForReady(client) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState === "complete" && document.body?.innerText.trim().length > 100');
    if (ready) {
      await delay(350);
      return;
    }
    await delay(150);
  }
  fail('Page did not reach a meaningful complete state.');
}

async function navigate(client, url) {
  await client.send('Page.navigate', { url });
  await waitForReady(client);
}

async function capture(client, name) {
  const result = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  const destination = path.join(artifactsDir, `${name}.png`);
  await writeFile(destination, Buffer.from(result.data, 'base64'));
  screenshots.push(destination);
}

async function verifyHome(client, viewport) {
  const report = await evaluate(client, `(() => {
    const visible = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const interactive = [...document.querySelectorAll('a, button')]
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return { text: el.textContent.trim().slice(0, 80), width: rect.width, height: rect.height };
      });
    return {
      title: document.title,
      bodyText: document.body.innerText,
      h1Count: document.querySelectorAll('h1').length,
      h1: document.querySelector('h1')?.textContent.trim() || '',
      sections: [...document.querySelectorAll('main section[id]')].map((section) => section.id),
      hrefs: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      interactive,
      nextError: Boolean(document.querySelector('[data-nextjs-dialog], nextjs-portal')),
      menuButton: Boolean(document.querySelector('.menu-button')),
      resumeLink: (() => {
        const link = document.querySelector('a[href="/Kunal_Vaghani_Resume.pdf"]');
        return link ? { download: link.getAttribute('download'), text: link.textContent.trim() } : null;
      })(),
    };
  })()`);

  if (!report.title.includes('AI/ML Systems')) fail(`Unexpected title: ${report.title}`);
  if (report.h1Count !== 1) fail(`Expected one h1, found ${report.h1Count}.`);
  if (!report.h1.includes('Kunal Vaghani')) fail(`Unexpected hero heading: ${report.h1}`);
  if (report.bodyText.includes('KUNALOS PORTFOLIO BIOS')) fail('Legacy BIOS is visible on the root route.');
  if (report.nextError) fail('Next.js error overlay detected.');
  if (report.scrollWidth > report.innerWidth + 2) fail(`Horizontal overflow: ${report.scrollWidth}px > ${report.innerWidth}px.`);
  if (!report.resumeLink) fail('Missing résumé download link.');
  if (report.resumeLink?.download !== 'Kunal_Vaghani_Resume.pdf') fail('Résumé link is missing its download filename.');

  for (const section of ['systems', 'projects', 'experience', 'skills', 'education', 'contact']) {
    if (!report.sections.includes(section)) fail(`Missing major section #${section}.`);
  }

  for (const text of ['Local AI Systems Lab', 'Multilingual Retrieval Engine', 'Local LLM Performance Lab', '154 tests passed', 'Architecture planned']) {
    if (!report.bodyText.includes(text)) fail(`Missing visible text: ${text}`);
  }

  for (const href of [
    'https://github.com/kunalvaghani',
    'https://www.linkedin.com/in/kunal-vaghani-b19217235/',
    'https://github.com/kunalvaghani/Local-AI-System-Lab',
    'mailto:kunalvaghani35@gmail.com',
    '/Kunal_Vaghani_Resume.pdf',
  ]) {
    if (!report.hrefs.includes(href)) fail(`Missing required link: ${href}`);
  }

  if (report.hrefs.some((href) => href?.startsWith('tel:'))) fail('A private phone link is published.');

  const resumeResponse = await evaluate(client, `(async () => {
    const response = await fetch('/Kunal_Vaghani_Resume.pdf');
    const bytes = new Uint8Array(await response.arrayBuffer());
    return {
      ok: response.ok,
      contentType: response.headers.get('content-type') || '',
      signature: String.fromCharCode(...bytes.slice(0, 5)),
      size: bytes.length,
    };
  })()`);
  if (!resumeResponse.ok) fail('Résumé PDF request failed.');
  if (!resumeResponse.contentType.includes('application/pdf')) fail(`Unexpected résumé content type: ${resumeResponse.contentType}`);
  if (resumeResponse.signature !== '%PDF-' || resumeResponse.size < 10_000) fail('Résumé download is not a valid PDF payload.');

  const smallTargets = report.interactive.filter((item) => item.width < 40 || item.height < 40);
  if (smallTargets.length > 0) {
    fail(`Interactive targets below 40px: ${smallTargets.map((item) => `${item.text} (${Math.round(item.width)}x${Math.round(item.height)})`).join(', ')}`);
  }

  if (viewport.width <= 880 && report.menuButton) {
    await evaluate(client, `(() => {
      const button = document.querySelector('.menu-button');
      button.click();
      return true;
    })()`);
    await delay(120);
    const menuResult = await evaluate(client, `(() => {
      const button = document.querySelector('.menu-button');
      const expanded = button.getAttribute('aria-expanded');
      const menu = document.querySelector('#primary-menu');
      const visible = getComputedStyle(menu).display !== 'none';
      return { expanded, visible };
    })()`);
    if (menuResult.expanded !== 'true' || !menuResult.visible) fail('Mobile menu did not expose its navigation links.');
    await evaluate(client, `(() => {
      const menu = document.querySelector('#primary-menu');
      const projects = [...menu.querySelectorAll('a')].find((a) => a.getAttribute('href') === '#projects');
      projects?.click();
      return Boolean(projects);
    })()`);
    await delay(250);
    const hash = await evaluate(client, 'location.hash');
    if (hash !== '#projects') fail(`Mobile project navigation did not update the hash: ${hash}`);
  }
}

async function verifyLegacy(client) {
  await navigate(client, `${baseUrl}/kunalos`);
  const report = await evaluate(client, `({
    title: document.title,
    text: document.body.innerText,
    source: document.querySelector('a[href*="/tree/b5528ed"]')?.href || '',
    overflow: document.documentElement.scrollWidth - window.innerWidth
  })`);
  if (!report.title.includes('Legacy KunalOS')) fail(`Unexpected legacy title: ${report.title}`);
  if (!report.text.includes('Preserved as evidence')) fail('Legacy design decision is not visible.');
  if (!report.source.includes('/tree/b5528ed')) fail('Legacy route does not link to the preserved KunalOS source commit.');
  if (report.overflow > 2) fail(`Legacy route has ${report.overflow}px horizontal overflow.`);
}

async function verifyMotion(client) {
  await evaluate(client, `sessionStorage.removeItem('kv-portfolio-intro-seen')`);
  await client.send('Page.reload');
  await waitForReady(client);

  const introVisible = await evaluate(client, `(() => {
    const intro = document.querySelector('.page-intro');
    return Boolean(intro) && getComputedStyle(intro).visibility === 'visible';
  })()`);
  if (!introVisible) fail('First-visit intro did not enter its visible state.');

  await delay(1100);
  const settled = await evaluate(client, `(() => {
    const typedText = document.querySelector('.hero-role span[aria-hidden="true"]')?.textContent || '';
    const firstProject = document.querySelector('.project-card');
    firstProject?.scrollIntoView({ block: 'center' });
    return {
      introRemoved: !document.querySelector('.page-intro'),
      typedCharacters: typedText.length,
    };
  })()`);
  await delay(900);
  const projectOpacity = await evaluate(client, `getComputedStyle(document.querySelector('.project-card')).opacity`);

  if (!settled.introRemoved) fail('First-visit intro did not leave the page after its short sequence.');
  if (settled.typedCharacters < 8) fail('Hero type animation did not produce visible text.');
  if (Number(projectOpacity) < 0.99) fail('Scroll-revealed project did not settle at full opacity.');
}

async function main() {
  await mkdir(artifactsDir, { recursive: true });
  await mkdir(userDataDir, { recursive: true });
  const browserPath = resolveBrowserPath();
  const browser = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,1000',
    'about:blank',
  ]);

  try {
    const target = await waitForChrome();
    const client = await cdpConnect(target.webSocketDebuggerUrl);
    await Promise.all([
      client.send('Runtime.enable'),
      client.send('Log.enable'),
      client.send('Page.enable'),
      client.send('Network.enable'),
    ]);

    for (const viewport of viewports) {
      activeViewport = viewport.name;
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.deviceScaleFactor,
        mobile: viewport.width < 600,
      });
      await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await navigate(client, baseUrl);
      await verifyHome(client, viewport);
      await capture(client, `${viewport.name}-home`);
    }

    activeViewport = 'desktop-motion';
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await navigate(client, baseUrl);
    await verifyMotion(client);

    activeViewport = 'legacy-mobile';
    await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await verifyLegacy(client);
    await capture(client, 'mobile-kunalos');
    client.close();
  } finally {
    browser.kill();
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }

  const ignoredConsolePatterns = [/favicon\.ico/i, /net::ERR_ABORTED/i];
  const filteredConsoleErrors = consoleErrors.filter((entry) => !ignoredConsolePatterns.some((pattern) => pattern.test(entry)));
  const filteredRequestFailures = requestFailures.filter((entry) => !ignoredConsolePatterns.some((pattern) => pattern.test(entry)));
  const report = {
    url: baseUrl,
    browserPath,
    viewports,
    screenshots,
    failures,
    consoleErrors: filteredConsoleErrors,
    requestFailures: filteredRequestFailures,
    passed: failures.length === 0 && filteredConsoleErrors.length === 0 && filteredRequestFailures.length === 0,
  };

  const reportPath = path.join(artifactsDir, 'qa-report.json');
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
