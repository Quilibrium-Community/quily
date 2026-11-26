import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isMdx, mdxToMarkdown } from './mdx';

const page = `import ParamsTable from '@site/src/components/ParamsTable';
import ApiTester from '@site/src/components/ApiTester';

export const HEADER_PARAMETERS = [
  { name: "Content-MD5", type: "String", description: "Digest | of body", required: true },
  // Optional ownership check.
  { name: "x-amz-expected-bucket-owner", type: "String", description: "Owner", required: false,
    validValues: ["a", "b"], },
];
export const RESPONSE_HEADERS = [];

# PutThing

\`\`\`js
import untouched from 'code-sample';
\`\`\`

### Headers

<ParamsTable parameters={HEADER_PARAMETERS} />

### Response Headers

<ParamsTable responseElements={RESPONSE_HEADERS} type="response" />

<ApiExample
  request={{ method: "PUT", path: "/?thing", headers: { "Content-MD5": "_MD5_" }, body: \`<A>x</A>\` }}
  response={{ status: 200 }}
/>

<Tabs>
<TabItem value="js" label="JavaScript">
Body text.
</TabItem>
</Tabs>

<ApiTester operation="PutThing" parameters={[{ name: "x", required: true }, ...HEADER_PARAMETERS]} />
`;

test('inlines parameter tables with the operation and section name', () => {
  const out = mdxToMarkdown(page, 'PutThing');
  assert.match(out, /\*\*PutThing: Headers\*\*/);
  assert.match(out, /\| `Content-MD5` \| String \| Yes \| Digest \\| of body \|/);
  assert.match(out, /\| `x-amz-expected-bucket-owner` \| String \| No \| Owner Valid values: a, b\. \|/);
  assert.match(out, /\*\*PutThing: Response Headers\*\*\n\nNone\./);
});

test('renders examples, keeps tab labels and code samples, drops widgets and imports', () => {
  const out = mdxToMarkdown(page, 'PutThing');
  assert.match(out, /```http\nPUT \/\?thing\nContent-MD5: _MD5_\n\n<A>x<\/A>\n```/);
  assert.match(out, /```http\nHTTP 200\n```/);
  assert.match(out, /\*\*JavaScript\*\*\nBody text\./);
  assert.match(out, /import untouched from 'code-sample';/);
  for (const gone of ['ApiTester', '@site/', 'export const', '<Tabs>', '</TabItem>']) assert(!out.includes(gone), gone);
});

test('leaves plain Markdown unchanged', () => {
  const plain = '# Title\n\nimport is a word here.\n';
  assert.equal(isMdx(plain), false);
  assert.equal(mdxToMarkdown(plain), plain);
});

test('a table built from an unparseable constant says so instead of losing rows', () => {
  const warnings: string[] = [];
  const out = mdxToMarkdown([
    "import X from '@site/x';",
    'export const P = [ { name: "a", required: cond ? true : false } ];',
    'export const Q = [ ...P, { name: "c", required: true } ];',
    '',
    '### Headers',
    '',
    '<ParamsTable parameters={Q} />',
    '',
    '~~~js',
    'const keep = [1, 2];',
    '~~~',
  ].join('\n'), 'Op', message => warnings.push(message));
  assert.match(out, /could not be converted/);
  assert(!out.includes('| `c` |'), 'partial table rendered');
  assert.match(out, /const keep = \[1, 2\];/);
  assert(!out.includes('cond ?'), 'unparseable source leaked');
  assert(warnings.length >= 2);
});
