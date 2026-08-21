#!/usr/bin/env node
/**
 * BUILD-TIME CONTENT CHECK — brief section 3.2.
 *
 * Fails the build if a retired address string, the unpublished phone number,
 * the administrative email, or a retired product name reaches RENDERED OUTPUT.
 *
 * Why this exists: those strings live in the source documents that get read all
 * the way through Sprint 6, so a copy-paste carrying one of them into a page is
 * the single most likely regression on this project. It is cheap to catch here
 * and expensive to catch after publication — Nebsam is a registered data
 * controller and the phone number belongs to a real person.
 *
 * SCOPE: only the build output in .next/. It deliberately does NOT scan docs/
 * or content-source/, because the internal registers there must name these
 * strings in order to be registers of what not to publish. Scanning them would
 * make the check unpassable and teach everyone to disable it.
 *
 * This file is a standalone Node script under scripts/. It is never imported by
 * the app, so the strings below cannot end up in a client bundle and cannot
 * trip the check on themselves.
 *
 * IMAGES ARE NOT COVERED. The KEBS permit scan carries the phone number and the
 * email as pixels; that needs the separate redaction pass tracked as V34.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const BUILD_DIR = '.next';

/** Extensions that can contain rendered text. */
const SCAN_EXT = new Set(['.html', '.js', '.json', '.txt', '.rsc', '.body']);

/** Paths inside .next that are build metadata, not output. */
const SKIP_DIRS = new Set(['cache', 'trace']);

/**
 * Each rule matches against a whitespace-normalised copy of the file, so a
 * string broken across lines by the HTML formatter is still caught.
 */
const RULES = [
  {
    label: 'Unpublished phone number',
    reference: 'brief PART 1.5 #8, PART 3.2',
    patterns: [/\+?254\s*727\s*727\s*461/i, /\b0727\s*727\s*461\b/i, /254727727461/],
  },
  {
    label: 'Administrative email',
    reference: 'brief PART 3.2',
    patterns: [/nebsam3kenya@gmail\.com/i],
  },
  {
    label: 'Retired Nairobi address',
    reference: 'brief PART 1.5 #6',
    patterns: [/equity\s*ngara/i, /ngara[\s-]*equity/i, /\butawala\b/i],
  },
  {
    label: 'Retired Mombasa address',
    reference: 'brief PART 1.5 #7',
    patterns: [/saba\s*saba/i, /kenyatta\s*ave/i],
  },
  {
    label: 'Retired product name',
    reference: 'brief PART 1.5 #1 and #3',
    // "Hybrid Car Alarm" is canonical and must not match "Hybrid Alarm".
    patterns: [/\bbasic\s+tracker\b/i, /\bhybrid\s+alarm\b/i],
  },
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      walk(full, out);
    } else if (SCAN_EXT.has(extname(entry))) {
      out.push(full);
    }
  }
  return out;
}

function excerpt(text, index) {
  const start = Math.max(0, index - 60);
  return text.slice(start, index + 80).replace(/\s+/g, ' ').trim();
}

const files = walk(BUILD_DIR);

if (files.length === 0) {
  console.error(
    `\n  check-retired-strings: found nothing to scan in ${BUILD_DIR}/.\n` +
      `  Run this after "next build", not instead of it.\n`,
  );
  process.exit(1);
}

const violations = [];

for (const file of files) {
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const normalised = raw.replace(/\s+/g, ' ');
  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = normalised.match(pattern);
      if (match && typeof match.index === 'number') {
        violations.push({
          file,
          rule: rule.label,
          reference: rule.reference,
          matched: match[0],
          context: excerpt(normalised, match.index),
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error(`\n  BUILD FAILED — retired strings found in rendered output\n`);
  for (const v of violations) {
    console.error(`  ${v.rule}  (${v.reference})`);
    console.error(`    file:    ${v.file}`);
    console.error(`    matched: ${JSON.stringify(v.matched)}`);
    console.error(`    context: …${v.context}…\n`);
  }
  console.error(
    `  ${violations.length} violation(s). These strings must never reach a public page.\n` +
      `  See brief PART 3.2 and the SOURCE NOTES blocks in content-source/.\n`,
  );
  process.exit(1);
}

console.log(
  `  check-retired-strings: clean — scanned ${files.length} build artefacts, ` +
    `${RULES.length} rule groups, 0 violations`,
);
