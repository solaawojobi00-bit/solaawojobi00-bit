#!/usr/bin/env node
// Fetches per-language byte totals across the user's own (non-fork) public
// repos via the GitHub REST API and renders a dark-themed SVG pie chart to
// assets/language-pie-chart.svg, matching the README's badge palette
// (black background, white text, style=for-the-badge conventions).

const fs = require('fs');
const path = require('path');

const USERNAME = process.env.GITHUB_USERNAME || 'solaawojobi00-bit';
const TOKEN = process.env.GITHUB_TOKEN;
const API_ROOT = 'https://api.github.com';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'language-pie-chart.svg');

// Languages to drop from the chart entirely. Edit as needed.
const EXCLUDED_LANGUAGES = [];

// How many individual slices to show before grouping the rest into "Other".
const MAX_SLICES = 8;

// Recognizable language colors (loosely based on GitHub's linguist palette).
// Anything not listed here gets a deterministic fallback color instead of
// failing.
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Rust: '#dea584',
  Python: '#3572A5',
  Solidity: '#AA6746',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dockerfile: '#384d54',
  PLpgSQL: '#336790',
  SQL: '#e38c00',
  Go: '#00ADD8',
  Ruby: '#701516',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Other: '#6e7681',
};

function warn(message) {
  console.log(`::warning::${message}`);
}

function fallbackColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 55%)`;
}

function colorFor(name) {
  return LANGUAGE_COLORS[name] || fallbackColor(name);
}

async function githubRequest(pathname) {
  const res = await fetch(`${API_ROOT}${pathname}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  return res;
}

function parseNextLink(linkHeader) {
  if (!linkHeader) return null;
  const parts = linkHeader.split(',');
  for (const part of parts) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

async function checkRateLimit() {
  try {
    const res = await githubRequest('/rate_limit');
    if (!res.ok) {
      warn(`Could not check rate limit (status ${res.status}); proceeding anyway.`);
      return true;
    }
    const data = await res.json();
    const remaining = data?.resources?.core?.remaining ?? 0;
    if (remaining < 20) {
      warn(`GitHub API rate limit nearly exhausted (${remaining} remaining). Skipping this run.`);
      return false;
    }
    return true;
  } catch (err) {
    warn(`Rate limit check failed (${err.message}); proceeding anyway.`);
    return true;
  }
}

async function listOwnedRepos(username) {
  const repos = [];
  let url = `/users/${username}/repos?per_page=100&type=owner`;
  while (url) {
    const res = await githubRequest(url);
    if (!res.ok) {
      warn(`Failed to list repos (status ${res.status}) at ${url}; stopping pagination.`);
      break;
    }
    const page = await res.json();
    repos.push(...page);
    url = parseNextLink(res.headers.get('link'));
    if (url) url = url.replace(API_ROOT, '');
  }
  return repos.filter((r) => !r.fork);
}

async function fetchLanguages(owner, repo) {
  try {
    const res = await githubRequest(`/repos/${owner}/${repo}/languages`);
    if (!res.ok) {
      warn(`Skipping ${owner}/${repo}: languages request failed (status ${res.status}).`);
      return {};
    }
    return await res.json();
  } catch (err) {
    warn(`Skipping ${owner}/${repo}: ${err.message}`);
    return {};
  }
}

function buildSlices(totals) {
  const filtered = Object.entries(totals).filter(
    ([lang]) => !EXCLUDED_LANGUAGES.includes(lang)
  );
  const grandTotal = filtered.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (grandTotal === 0) return [];

  filtered.sort((a, b) => b[1] - a[1]);

  const top = filtered.slice(0, MAX_SLICES);
  const rest = filtered.slice(MAX_SLICES);
  const restTotal = rest.reduce((sum, [, bytes]) => sum + bytes, 0);

  const slices = top.map(([name, bytes]) => ({
    name,
    bytes,
    pct: (bytes / grandTotal) * 100,
  }));

  if (restTotal > 0) {
    slices.push({ name: 'Other', bytes: restTotal, pct: (restTotal / grandTotal) * 100 });
  }

  return slices;
}

function polarPoint(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function renderSvg(slices) {
  const width = 480;
  const height = 260;
  const cx = 130;
  const cy = 130;
  const r = 100;

  let cumulativeAngle = 0;
  const paths = [];

  if (slices.length === 1) {
    // A single 360-degree slice can't be drawn as one arc path; render a
    // full circle instead.
    paths.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colorFor(slices[0].name)}" />`
    );
  } else {
    for (const slice of slices) {
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + (slice.pct / 100) * 360;
      const start = polarPoint(cx, cy, r, startAngle);
      const end = polarPoint(cx, cy, r, endAngle);
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      paths.push(
        `<path d="M ${cx},${cy} L ${start.x.toFixed(2)},${start.y.toFixed(2)} A ${r},${r} 0 ${largeArc} 1 ${end.x.toFixed(2)},${end.y.toFixed(2)} Z" fill="${colorFor(slice.name)}" stroke="#000000" stroke-width="1" />`
      );
      cumulativeAngle = endAngle;
    }
  }

  const legendX = 270;
  const legendItemHeight = 26;
  const legendStartY = 40;
  const legend = slices
    .map((slice, i) => {
      const y = legendStartY + i * legendItemHeight;
      const label = `${slice.name} (${slice.pct.toFixed(1)}%)`;
      return `
      <rect x="${legendX}" y="${y - 12}" width="14" height="14" rx="2" fill="${colorFor(slice.name)}" />
      <text x="${legendX + 22}" y="${y - 1}" font-family="'Segoe UI', Helvetica, Arial, sans-serif" font-size="13" fill="#ffffff">${label}</text>`;
    })
    .join('');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="10" fill="#000000" />
  <text x="20" y="24" font-family="'Segoe UI', Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Languages</text>
  <g transform="translate(0, 10)">
    ${paths.join('\n    ')}
  </g>
  <g>${legend}</g>
</svg>
`;
}

async function main() {
  const canProceed = await checkRateLimit();
  if (!canProceed) {
    process.exitCode = 0;
    return;
  }

  const repos = await listOwnedRepos(USERNAME);
  if (repos.length === 0) {
    warn(`No non-fork repos found for ${USERNAME}; leaving existing chart untouched.`);
    process.exitCode = 0;
    return;
  }

  const totals = {};
  for (const repo of repos) {
    const languages = await fetchLanguages(USERNAME, repo.name);
    for (const [lang, bytes] of Object.entries(languages)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }

  const slices = buildSlices(totals);
  if (slices.length === 0) {
    warn('No language data collected; leaving existing chart untouched.');
    process.exitCode = 0;
    return;
  }

  const svg = renderSvg(slices);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, svg);
  console.log(`Wrote ${OUTPUT_PATH} with ${slices.length} slices from ${repos.length} repos.`);
}

main().catch((err) => {
  warn(`Unexpected failure: ${err.message}`);
  process.exitCode = 0;
});
