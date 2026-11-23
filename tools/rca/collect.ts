import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

export interface CollectedFailure {
  id: string;
  title: string;
  errorMessage: string;
  interstitialDetected: boolean;
  artifacts: string[];
}

export interface RcaBundle {
  collectedAt: string;
  workspaceRoot: string;
  failures: CollectedFailure[];
  notes: string[];
}

const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, replacement: '[REDACTED_EMAIL]' },
  { pattern: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CARD]' },
  { pattern: /(api[_-]?key|token|secret|password)\s*[:=]\s*['"]?[^\s'"]+['"]?/gi, replacement: '$1=[REDACTED]' },
];

export function redactText(input: string): string {
  let output = input;
  for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

function walkFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, acc);
    } else {
      acc.push(fullPath);
    }
  }
  return acc;
}

function collectBundle(cwd: string = process.cwd()): RcaBundle {
  const testResultsDir = path.join(cwd, 'test-results');
  const outDir = path.join(cwd, 'artifacts', 'rca');
  fs.mkdirSync(outDir, { recursive: true });

  const allFiles = walkFiles(testResultsDir);
  const failures: CollectedFailure[] = [];
  const notes: string[] = [];

  const errorContextFiles = allFiles.filter((f) => path.basename(f) === 'error-context.md');
  const mediaFiles = allFiles
    .filter((f) => /\.(png|jpg|jpeg|zip|webm|md|txt|json)$/i.test(f))
    .map((f) => path.relative(cwd, f).replaceAll('\\', '/'));

  for (let i = 0; i < errorContextFiles.length; i++) {
    const filePath = errorContextFiles[i];
    const rawContent = redactText(fs.readFileSync(filePath, 'utf8'));
    const dirRel = path.relative(cwd, path.dirname(filePath)).replaceAll('\\', '/');
    const relatedArtifacts = mediaFiles.filter((m) => m.startsWith(dirRel));

    const interstitialDetected =
      /EXTERNAL_INTERSTITIAL_BLOCK/i.test(rawContent) || /one moment, please/i.test(rawContent);

    failures.push({
      id: `FAIL-${i + 1}`,
      title: path.basename(path.dirname(filePath)),
      errorMessage: rawContent.slice(0, 1500),
      interstitialDetected,
      artifacts: relatedArtifacts,
    });
  }

  if (failures.length === 0) {
    notes.push('No failure error-context artifacts found in test-results/. Bundle is empty or clean.');
  }

  const bundle: RcaBundle = {
    collectedAt: new Date().toISOString(),
    workspaceRoot: path.basename(cwd),
    failures,
    notes,
  };

  const bundlePath = path.join(outDir, 'bundle.json');
  fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2), 'utf8');
  console.log(`RCA bundle written to ${path.relative(cwd, bundlePath)} (${failures.length} failure(s)).`);
  return bundle;
}

collectBundle();