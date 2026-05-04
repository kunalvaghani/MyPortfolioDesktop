import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { request } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(root, `.qa-chrome-${Date.now()}`);
const screenshotPath = path.join(root, 'portfolio-qa.png');
const port = 9223;
const url = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3000';

const failures = [];
const browserErrors = [];

function fail(message) {
  failures.push(message);
}

function httpJson(targetUrl) {
  return new Promise((resolve, reject) => {
    const req = request(targetUrl, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error(`Timed out requesting ${targetUrl}`));
    });
    req.end();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChrome() {
  const versionUrl = `http://127.0.0.1:${port}/json/version`;
  for (let i = 0; i < 60; i += 1) {
    try {
      return await httpJson(versionUrl);
    } catch {
      await delay(250);
    }
  }
  throw new Error('Chrome did not expose a DevTools endpoint.');
}

async function waitForPageTarget() {
  const listUrl = `http://127.0.0.1:${port}/json/list`;
  for (let i = 0; i < 60; i += 1) {
    try {
      const targets = await httpJson(listUrl);
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) {
        return page;
      }
    } catch {
      // Chrome may be starting; retry below.
    }
    await delay(250);
  }
  throw new Error('Chrome did not expose a page DevTools target.');
}

function cdpConnect(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl);
  let id = 0;
  const callbacks = new Map();

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && callbacks.has(message.id)) {
      const { resolve, reject } = callbacks.get(message.id);
      callbacks.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
      return;
    }

    if (message.method === 'Runtime.exceptionThrown') {
      browserErrors.push(message.params.exceptionDetails.text);
    }
    if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params.entry.level)) {
      browserErrors.push(message.params.entry.text);
    }
  });

  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          id += 1;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((cmdResolve, cmdReject) => {
            callbacks.set(id, { resolve: cmdResolve, reject: cmdReject });
          });
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener('error', reject);
  });
}

async function evaluate(client, expression, returnByValue = true) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result?.value;
}

function pageScript(body) {
  return `(() => { ${body} })()`;
}

async function clickByText(client, selector, text, exact = true) {
  return evaluate(
    client,
    pageScript(`
      const items = [...document.querySelectorAll(${JSON.stringify(selector)})];
      const expected = ${JSON.stringify(text)};
      const exact = ${JSON.stringify(exact)};
      const el = items.find((node) => {
        const content = node.textContent.trim();
        return exact ? content === expected : content.includes(expected);
      });
      if (!el) return false;
      el.click();
      return true;
    `),
  );
}

async function visibleTextIncludes(client, text) {
  return evaluate(
    client,
    `document.body && document.body.innerText.includes(${JSON.stringify(text)})`,
  );
}

async function assertText(client, text) {
  if (!(await visibleTextIncludes(client, text))) {
    fail(`Missing visible text: ${text}`);
  }
}

async function assertClick(client, selector, text, exact = true) {
  if (!(await clickByText(client, selector, text, exact))) {
    fail(`Could not click ${text}`);
  }
  await delay(180);
}

async function main() {
  await mkdir(userDataDir, { recursive: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,1000',
    url,
  ]);

  chrome.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    if (/error|failed/i.test(text) && !/DevTools listening/i.test(text)) {
      browserErrors.push(text.trim());
    }
  });

  try {
    await waitForChrome();
    const pageTarget = await waitForPageTarget();
    const client = await cdpConnect(pageTarget.webSocketDebuggerUrl);
    await client.send('Runtime.enable');
    await client.send('Log.enable');
    await client.send('Page.enable');
    await client.send('Page.navigate', { url });
    await delay(1200);

    const title = await evaluate(client, 'document.title');
    if (!title.includes('KunalOS')) {
      fail(`Unexpected title: ${title}`);
    }

    await assertText(client, 'KUNALOS PORTFOLIO BIOS');
    await assertClick(client, 'button', 'Press Enter to continue');
    await assertText(client, 'Kunal Vaghani');
    await assertText(client, 'Game Developer and Engine Programmer');

    const desktopIcons = ['My Portfolio', 'Games', '3D Models', 'Skills', 'Contact', 'Command'];
    for (const label of desktopIcons) {
      await assertText(client, label);
    }

    await assertClick(client, 'button', 'Start');
    await assertText(client, 'GitHub Repo');
    await assertClick(client, '.start-items button', 'Games');
    await assertText(client, 'Games');

    const projectNames = [
      'OpenGL Game Engine',
      'Vulkan Game Engine',
      'The Village',
      'Kitchen Hell',
      'Game AI From Scratch',
      'Commando Squad Runner',
      'Slide Maze',
    ];
    for (const project of projectNames) {
      await assertText(client, project);
    }

    for (const project of projectNames) {
      await assertClick(client, '.program-tile', project, false);
      await assertText(client, project);
    }

    const expectedLinks = [
      'https://github.com/kunalvaghani/Kunals_Repo',
      'https://aymed.itch.io/thevillage',
      'https://nktrien.itch.io/kitchen-hell',
      'https://kunalvaghani.github.io/OnlineFakeAdGame/',
      'https://github.com/kunalvaghani/OnlineFakeAdGame',
      'https://docs.google.com/presentation/d/10A2k9nGDKK38CU_8jXvUmxVqh9_6iW45s6vXX9ODi50/edit?usp=sharing',
      'mailto:kunalvaghani35@gmail.com',
      'tel:+14379873240',
      'https://www.linkedin.com/in/kunal-vaghani-b19217235/',
      'https://github.com/kunalvaghani',
    ];

    await assertClick(client, 'button', 'Start');
    await assertClick(client, '.start-items button', 'Contact');
    await assertText(client, 'Get in touch');
    const hrefs = await evaluate(
      client,
      '[...document.querySelectorAll("a")].map((a) => a.href)',
    );
    for (const href of expectedLinks) {
      if (!hrefs.includes(href)) {
        fail(`Missing link href: ${href}`);
      }
    }

    await assertClick(client, 'button', 'Start');
    await assertClick(client, '.start-items button', 'Skills.cpl');
    await assertText(client, 'System Capabilities');
    await assertText(client, 'Vulkan');
    await assertText(client, 'AI Pathfinding');

    await assertClick(client, 'button', 'Start');
    await assertClick(client, '.start-items button', 'Models');
    await assertText(client, 'Village Day / Night');
    await assertText(client, 'Indian Gada');

    await assertClick(client, 'button', 'Start');
    await assertClick(client, '.start-items button', 'Command.com');
    await assertText(client, 'C:\\PORTFOLIO>');

    const imageFailures = await evaluate(
      client,
      pageScript(`
        return [...document.images]
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.src);
      `),
    );
    for (const src of imageFailures) {
      fail(`Image failed to load: ${src}`);
    }

    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));

    client.close();
  } finally {
    chrome.kill();
  }

  const filteredBrowserErrors = browserErrors.filter(
    (error) =>
      error &&
      !error.includes('DevTools listening') &&
      !error.includes('SSL client socket') &&
      !error.includes('handshake failed') &&
      !error.includes('external_registry_loader_win') &&
      !error.includes('apps.crx') &&
      !error.includes('PHONE_REGISTRATION_ERROR') &&
      !error.includes('DEPRECATED_ENDPOINT'),
  );

  const report = {
    url,
    screenshotPath,
    failures,
    browserErrors: filteredBrowserErrors,
    passed: failures.length === 0 && filteredBrowserErrors.length === 0,
  };

  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) {
    process.exitCode = 1;
  }

  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
