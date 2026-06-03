export interface CreateIssueParams {
  title: string;
  correction: string;
  discordUsername: string;
  originalQuestion: string;
  quilyAnswer: string;
  /** Discord message link to the original bot answer, if available */
  discordMessageLink?: string;
  /** "knowledge" (default) for factual corrections; "behavior" for bot misbehavior reports */
  kind?: 'knowledge' | 'behavior';
}

/**
 * Create a GitHub issue via the REST API.
 * Returns the issue HTML URL on success.
 * Throws on failure (caller should catch and log).
 */
export async function createGitHubIssue(params: CreateIssueParams): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'Quilibrium-Community/quily';

  if (!token) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const discordLink = params.discordMessageLink
    ? `\n\n[View original message on Discord](${params.discordMessageLink})`
    : '';

  const isBehavior = params.kind === 'behavior';
  const heading = isBehavior ? 'Bot Behavior Report (via Discord)' : 'Correction (via Discord)';
  const userSectionTitle = isBehavior ? 'What the user reported:' : 'What the user corrected:';
  const primaryLabel = isBehavior ? 'bot-behavior' : 'knowledge-update';
  const footer = isBehavior
    ? '*This issue was automatically created by Quily from a Discord bot-behavior report.*'
    : '*This issue was automatically created by Quily from a Discord correction.*';

  const body = `## ${heading}

**Reported by:** ${params.discordUsername}

### What Quily said:
> ${params.quilyAnswer.replace(/\n/g, '\n> ')}

### ${userSectionTitle}
> ${params.correction.replace(/\n/g, '\n> ')}

### Original question:
> ${params.originalQuestion.replace(/\n/g, '\n> ')}
${discordLink}
---
${footer}`;

  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title: params.title,
      body,
      labels: [primaryLabel, 'auto-reported'],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as { html_url: string };
  return data.html_url;
}
