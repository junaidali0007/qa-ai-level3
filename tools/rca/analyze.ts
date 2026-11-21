import fs from 'node:fs';
import path from 'node:path';

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

export type RcaCategory =
  | 'PRODUCT_DEFECT'
  | 'TEST_SCRIPT_DEFECT'
  | 'LOCATOR_OR_UI_CHANGE'
  | 'TEST_DATA_OR_STATE'
  | 'ENVIRONMENT_OR_NETWORK'
  | 'TIMING_OR_FLAKINESS'
  | 'THIRD_PARTY_DEPENDENCY'
  | 'UNKNOWN';

export interface RcaFinding {
  failureId: string;
  title: string;
  category: RcaCategory;
  confidence: number;
  summary: string;
  evidence: string[];
  recommendedAction: string;
}

export interface RcaReport {
  generatedAt: string;
  mode: 'deterministic-fallback' | 'ai-assisted';
  hasAiKey: boolean;
  findings: RcaFinding[];
}

function analyzeBundle(cwd: string = process.cwd()): RcaReport {
  const outDir = path.join(cwd, 'artifacts', 'rca');
  const bundlePath = path.join(outDir, 'bundle.json');
  fs.mkdirSync(outDir, { recursive: true });

  const hasAiKey = Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);
  const mode: RcaReport['mode'] = hasAiKey ? 'ai-assisted' : 'deterministic-fallback';

  if (!fs.existsSync(bundlePath)) {
    const emptyReport: RcaReport = {
      generatedAt: new Date().toISOString(),
      mode,
      hasAiKey,
      findings: [],
    };
    fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(emptyReport, null, 2), 'utf8');
    fs.writeFileSync(
      path.join(outDir, 'report.md'),
      '# RCA Report\n\nNo `artifacts/rca/bundle.json` found. Run `npm run rca:collect` after a test failure.\n',
      'utf8',
    );
    return emptyReport;
  }

  const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8')) as RcaBundle;
  const findings: RcaFinding[] = bundle.failures.map((failure: CollectedFailure) => {
    if (failure.interstitialDetected) {
      const hasVisualOrTrace = failure.artifacts.some((artifactPath: string) =>
        /\.(png|zip)$/i.test(artifactPath),
      );
      return {
        failureId: failure.id,
        title: failure.title,
        category: 'THIRD_PARTY_DEPENDENCY',
        confidence: hasVisualOrTrace ? 0.85 : 0.65,
        summary:
          'Target site returned an interstitial/challenge state ("One moment, please..." or EXTERNAL_INTERSTITIAL_BLOCK) before reaching the expected view.',
        evidence: failure.artifacts.length > 0 ? failure.artifacts : ['error-context.md'],
        recommendedAction:
          'Do not bypass anti-bot controls or add arbitrary sleeps. Wait before re-running, keep concurrency low (workers <= 2), and verify behavior in CI.',
      };
    }

    const hasArtifacts = failure.artifacts.length > 0;
    return {
      failureId: failure.id,
      title: failure.title,
      category: 'UNKNOWN',
      confidence: hasArtifacts ? 0.4 : 0.2,
      summary:
        'Failure captured in artifacts; requires human correlation across trace, screenshot, and assertion before assigning a product or script defect.',
      evidence: hasArtifacts ? failure.artifacts : ['Limited failure artifacts available'],
      recommendedAction:
        'Inspect trace.zip and screenshot in artifacts, reproduce with low concurrency, and classify after human review.',
    };
  });

  const report: RcaReport = {
    generatedAt: new Date().toISOString(),
    mode,
    hasAiKey,
    findings,
  };

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');

  const mdLines = [
    '# RCA Report',
    '',
    `- **Generated At:** ${report.generatedAt}`, `- **Mode:** ${report.mode}`,
    `- **AI Key Configured:** ${report.hasAiKey ? 'Yes' : 'No (using deterministic fallback)'}`, '', '## Findings', '', ];  if (findings.length === 0) { mdLines.push('No failure findings recorded in the current bundle.'); } else { for (const f of findings) { mdLines.push(`### ${f.failureId}: ${f.title}`); mdLines.push(`- **Category:** \`${f.category}\``); mdLines.push(`- **Confidence:** ${f.confidence.toFixed(2)}`);
      mdLines.push(`- **Summary:** ${f.summary}`); mdLines.push(`- **Evidence:** ${f.evidence.join(', ')}`);
      mdLines.push(`- **Recommended Action:** ${f.recommendedAction}`);
      mdLines.push('');
    }
  }

  fs.writeFileSync(path.join(outDir, 'report.md'), mdLines.join('\n'), 'utf8');
  console.log(`RCA report written to artifacts/rca/report.json and artifacts/rca/report.md (${mode}).`);
  return report;
}

analyzeBundle();