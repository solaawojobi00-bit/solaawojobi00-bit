#!/usr/bin/env node
// Measures "languages actually used" by looking at the files changed across
// every PR authored by the user - their own repos AND repos they've
// contributed to - rather than whole-repo byte totals. Whole-repo totals
// would misattribute code written by other contributors in shared projects,
// and would also count generated/vendored artifacts (e.g. a large exported
// HTML file) as if they were hand-written. Counting by PR diff lines avoids
// both problems.
//
// Renders a dark-themed SVG pie chart to assets/language-pie-chart.svg,
// matching the README's badge palette (black background, white text,
// style=for-the-badge conventions).

const fs = require('fs');
const path = require('path');

const USERNAME = process.env.GITHUB_USERNAME || 'solaawojobi00-bit';
const TOKEN = process.env.GITHUB_TOKEN;
const API_ROOT = 'https://api.github.com';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'language-pie-chart.svg');

// Repos to exclude entirely (e.g. because the work there isn't
// representative hand-written code - delta-river-dashboard's HTML is a
// large generated dashboard export, not hand-written markup).
const EXCLUDED_REPOS = ['delta-river-dashboard'];

// PR titles matching this are test/throwaway PRs, not real work.
const THROWAWAY_TITLE_PATTERN = /throwaway|do not merge/i;

// Languages to drop from the chart entirely (folded into "Other languages"
// like everything past MAX_SLICES). Edit as needed.
const EXCLUDED_LANGUAGES = [];

// How many individual slices to show before grouping the rest into "Other
// languages".
const MAX_SLICES = 3;

const EXT_LANGUAGE = {
  '.ts': 'TypeScript', '.tsx': 'TypeScript',
  '.js': 'JavaScript', '.jsx': 'JavaScript', '.mjs': 'JavaScript', '.cjs': 'JavaScript',
  '.rs': 'Rust',
  '.py': 'Python',
  '.sql': 'SQL',
  '.css': 'CSS', '.scss': 'CSS',
  '.html': 'HTML',
  '.sh': 'Shell', '.bash': 'Shell',
  '.go': 'Go',
  '.rb': 'Ruby',
  '.java': 'Java',
  '.c': 'C', '.h': 'C',
  '.cpp': 'C++', '.hpp': 'C++',
  '.sol': 'Solidity',
};

// Raw SQL is often embedded as query strings inside host-language files
// (e.g. better-sqlite3/pg template strings in .ts/.js). Detecting it in the
// diff keeps that real SQL work from being invisible just because it lives
// inside a .ts file, and keeps it from inflating the host language's count.
const SQL_LINE_PATTERN = /^\s*(CREATE\s+(TABLE|INDEX|VIEW)|SELECT\s|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|ALTER\s+TABLE|DROP\s+(TABLE|INDEX)|PRAGMA\s|WITH\s+\w+\s+AS\s*\()/i;

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
  SQL: '#e38c00',
  Go: '#00ADD8',
  Ruby: '#701516',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'Other languages': '#6e7681',
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

async function githubRequest(url) {
  const fullUrl = url.startsWith('http') ? url : `${API_ROOT}${url}`;
  return fetch(fullUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
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

async function checkRateLimit(minRequired) {
  try {
    const res = await githubRequest('/rate_limit');
    if (!res.ok) {
      warn(`Could not check rate limit (status ${res.status}); proceeding anyway.`);
      return true;
    }
    const data = await res.json();
    const remaining = data?.resources?.core?.remaining ?? 0;
    if (remaining < minRequired) {
      warn(`GitHub API rate limit nearly exhausted (${remaining} remaining, need ~${minRequired}). Skipping this run.`);
      return false;
    }
    return true;
  } catch (err) {
    warn(`Rate limit check failed (${err.message}); proceeding anyway.`);
    return true;
  }
}

// Every PR authored by the user, any state, across all of GitHub, via the
// search API - covers both their own repos and repos they've contributed to.
async function listAuthoredPRs(username) {
  const prs = [];
  let url = `/search/issues?q=${encodeURIComponent(`author:${username} is:pr`)}&per_page=100`;
  while (url) {
    const res = await githubRequest(url);
    if (!res.ok) {
      warn(`Failed to list PRs (status ${res.status}) at ${url}; stopping pagination.`);
      break;
    }
    const data = await res.json();
    for (const item of data.items || []) {
      const repoFullName = item.repository_url.replace('https://api.github.com/repos/', '');
      const [, repoName] = repoFullName.split('/');
      prs.push({ repoFullName, repoName, number: item.number, title: item.title });
    }
    url = parseNextLink(res.headers.get('link'));
  }
  return prs;
}

async function fetchPRFiles(repoFullName, number) {
  const files = [];
  let url = `/repos/${repoFullName}/pulls/${number}/files?per_page=100`;
  while (url) {
    const res = await githubRequest(url);
    if (!res.ok) {
      warn(`Skipping ${repoFullName}#${number}: files request failed (status ${res.status}).`);
      return files;
    }
    const batch = await res.json();
    files.push(...batch);
    url = parseNextLink(res.headers.get('link'));
  }
  return files;
}

function extOf(filename) {
  const m = filename.match(/(\.[a-zA-Z0-9]+)$/);
  return m ? m[1].toLowerCase() : null;
}

function countEmbeddedSqlLines(patch) {
  if (!patch) return 0;
  let count = 0;
  for (const line of patch.split('\n')) {
    if (!/^[+-]/.test(line) || /^[+-]{3}/.test(line)) continue;
    if (SQL_LINE_PATTERN.test(line.slice(1))) count++;
  }
  return count;
}

function buildSlices(totals) {
  const filtered = Object.entries(totals).filter(
    ([lang]) => !EXCLUDED_LANGUAGES.includes(lang)
  );
  const grandTotal = filtered.reduce((sum, [, weight]) => sum + weight, 0);
  if (grandTotal === 0) return [];

  filtered.sort((a, b) => b[1] - a[1]);

  const top = filtered.slice(0, MAX_SLICES);
  const rest = filtered.slice(MAX_SLICES);
  const restTotal = rest.reduce((sum, [, weight]) => sum + weight, 0);

  const slices = top.map(([name, weight]) => ({
    name,
    weight,
    pct: (weight / grandTotal) * 100,
  }));

  if (restTotal > 0) {
    slices.push({ name: 'Other languages', weight: restTotal, pct: (restTotal / grandTotal) * 100 });
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
  const prs = await listAuthoredPRs(USERNAME);
  if (prs.length === 0) {
    warn(`No PRs found for ${USERNAME}; leaving existing chart untouched.`);
    process.exitCode = 0;
    return;
  }

  // Rough budget: one files-request per PR (most PRs fit in one page).
  const canProceed = await checkRateLimit(prs.length + 20);
  if (!canProceed) {
    process.exitCode = 0;
    return;
  }

  const totals = {};
  let skipped = 0;

  for (const pr of prs) {
    if (EXCLUDED_REPOS.includes(pr.repoName) || THROWAWAY_TITLE_PATTERN.test(pr.title)) {
      skipped++;
      continue;
    }

    let files;
    try {
      files = await fetchPRFiles(pr.repoFullName, pr.number);
    } catch (err) {
      warn(`Skipping ${pr.repoFullName}#${pr.number}: ${err.message}`);
      continue;
    }

    for (const f of files) {
      const ext = extOf(f.filename);
      const lang = ext && EXT_LANGUAGE[ext];
      if (!lang) continue;

      const totalChanged = (f.additions || 0) + (f.deletions || 0);
      const sqlLines = lang === 'SQL' ? 0 : Math.min(countEmbeddedSqlLines(f.patch), totalChanged);
      const hostWeight = totalChanged - sqlLines;

      if (sqlLines > 0) totals.SQL = (totals.SQL || 0) + sqlLines;
      if (hostWeight > 0) totals[lang] = (totals[lang] || 0) + hostWeight;
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
  console.log(`Wrote ${OUTPUT_PATH} with ${slices.length} slices from ${prs.length - skipped}/${prs.length} PRs.`);
}

main().catch((err) => {
  warn(`Unexpected failure: ${err.message}`);
  process.exitCode = 0;
});
