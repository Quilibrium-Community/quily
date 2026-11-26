/**
 * Convert Docusaurus MDX API pages into the plain Markdown a reader sees.
 *
 * The official API reference keeps facts such as "this header is required" in
 * JavaScript arrays at the top of the file and renders them through
 * <ParamsTable>. Ingested as-is, those facts land in code-only chunks with no
 * heading or operation name, far from the section that explains them. This
 * module inlines each table where the page renders it, renders request
 * examples as HTTP blocks, and drops imports and the interactive <ApiTester>.
 *
 * The literal parser below reads data only. It never evaluates document code.
 */

type Literal = string | number | boolean | null | Literal[] | { [key: string]: Literal };

class LiteralParser {
  private i = 0;
  constructor(private readonly src: string, private readonly scope: Map<string, Literal>) {}

  get index() { return this.i; }

  parse(): Literal {
    this.space();
    const c = this.src[this.i];
    if (c === '[') return this.array();
    if (c === '{') return this.object();
    if (c === '"' || c === "'" || c === '`') return this.string();
    if (c === '-' || /\d/.test(c)) return this.number();
    const word = this.identifier();
    if (word === 'true') return true;
    if (word === 'false') return false;
    if (word === 'null' || word === 'undefined') return null;
    // A reference to another constant on the page, or an unknown symbol.
    return this.scope.get(word) ?? word;
  }

  private space() {
    for (;;) {
      while (/\s/.test(this.src[this.i] ?? '')) this.i++;
      if (this.src.startsWith('//', this.i) || this.src.startsWith('/*', this.i)) {
        const close = this.src.startsWith('//', this.i) ? '\n' : '*/';
        const end = this.src.indexOf(close, this.i + 2);
        this.i = end < 0 ? this.src.length : end + close.length;
      } else return;
    }
  }

  private expect(c: string) {
    this.space();
    if (this.src[this.i] !== c) throw new Error(`Expected ${c} at ${this.i}`);
    this.i++;
  }

  private identifier() {
    const match = /^[A-Za-z_$][\w$.]*/.exec(this.src.slice(this.i));
    if (!match) throw new Error(`Unexpected token at ${this.i}`);
    this.i += match[0].length;
    return match[0];
  }

  private number() {
    const match = /^-?\d+(\.\d+)?/.exec(this.src.slice(this.i))!;
    this.i += match[0].length;
    return Number(match[0]);
  }

  private string() {
    const quote = this.src[this.i++];
    let out = '';
    while (this.i < this.src.length && this.src[this.i] !== quote) {
      if (this.src[this.i] === '\\') {
        const next = this.src[this.i + 1];
        out += next === 'n' ? '\n' : next === 't' ? '\t' : next;
        this.i += 2;
      } else out += this.src[this.i++];
    }
    if (this.src[this.i] !== quote) throw new Error('Unterminated string');
    this.i++;
    return out;
  }

  private array(): Literal[] {
    this.expect('[');
    const out: Literal[] = [];
    for (;;) {
      this.space();
      if (this.src[this.i] === ']') { this.i++; return out; }
      if (this.src.startsWith('...', this.i)) {
        this.i += 3;
        const spread = this.parse();
        if (Array.isArray(spread)) out.push(...spread);
      } else out.push(this.parse());
      this.space();
      if (this.src[this.i] === ',') this.i++;
    }
  }

  private object(): { [key: string]: Literal } {
    this.expect('{');
    const out: { [key: string]: Literal } = {};
    for (;;) {
      this.space();
      if (this.src[this.i] === '}') { this.i++; return out; }
      if (this.src.startsWith('...', this.i)) {
        this.i += 3;
        const spread = this.parse();
        if (spread && typeof spread === 'object' && !Array.isArray(spread)) Object.assign(out, spread);
      } else {
        const c = this.src[this.i];
        const key = c === '"' || c === "'" ? this.string() : this.identifier();
        this.expect(':');
        out[key] = this.parse();
      }
      this.space();
      if (this.src[this.i] === ',') this.i++;
    }
  }
}

/** Find the end of a self-closing JSX element starting at `start`, skipping braces and strings. */
function jsxEnd(src: string, start: number): number {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      // Strings only delimit inside an expression; JSX attribute text is literal.
      if (depth > 0 || c === '"') {
        i++;
        while (i < src.length && src[i] !== c) i += src[i] === '\\' ? 2 : 1;
      }
    } else if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (depth === 0 && c === '/' && src[i + 1] === '>') return i + 2;
    else if (depth === 0 && c === '>') return i + 1;
  }
  return -1;
}

const stripHtml = (text: string) => text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const cell = (text: string) => stripHtml(text).replace(/\|/g, '\\|');

function rows(items: Literal, prefix = ''): Array<Record<string, Literal>> {
  if (!Array.isArray(items)) return [];
  return items.flatMap(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const name = `${prefix}${String(item.name ?? '')}`;
    const children = item.children ?? item.fields;
    return [{ ...item, name }, ...rows(children ?? [], `${name}.`)];
  });
}

function renderTable(items: Literal, lead: string): string {
  const list = rows(items);
  // The site renders an empty table; say so, since "no headers" is an answer.
  if (!list.length) return Array.isArray(items) ? `${lead}

None.` : '';
  const hasType = list.some(row => row.type != null);
  const hasRequired = list.some(row => typeof row.required === 'boolean');
  const header = ['Name', ...(hasType ? ['Type'] : []), ...(hasRequired ? ['Required'] : []), 'Description'];
  const lines = list.map(row => {
    const values = Array.isArray(row.validValues) ? row.validValues : Array.isArray(row.values) ? row.values : null;
    const description = [String(row.description ?? ''), values ? `Valid values: ${values.join(', ')}.` : '']
      .filter(Boolean).join(' ');
    return `| ${[
      `\`${cell(String(row.name))}\``,
      ...(hasType ? [cell(String(row.type ?? ''))] : []),
      ...(hasRequired ? [row.required === true ? 'Yes' : row.required === false ? 'No' : ''] : []),
      cell(description),
    ].join(' | ')} |`;
  });
  return [lead, '', `| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`, ...lines].join('\n');
}

function renderHttp(message: Literal, kind: 'request' | 'response'): string {
  if (!message || typeof message !== 'object' || Array.isArray(message) || !Object.keys(message).length) return '';
  const headers = message.headers && typeof message.headers === 'object' && !Array.isArray(message.headers)
    ? Object.entries(message.headers).map(([name, value]) => `${name}: ${String(value)}`) : [];
  const first = kind === 'request' ? `${message.method ?? ''} ${message.path ?? ''}`.trim() : `HTTP ${message.status ?? ''}`.trim();
  const body = typeof message.body === 'string' ? message.body.trim() :
    message.body != null ? JSON.stringify(message.body, null, 2) : '';
  return ['```http', first, ...headers, ...(body ? ['', body] : []), '```'].join('\n');
}

function attribute(tag: string, name: string): string | null {
  const start = tag.search(new RegExp(`\\b${name}=\\{`));
  if (start < 0) return null;
  let depth = 0;
  for (let i = tag.indexOf('{', start); i < tag.length; i++) {
    if (tag[i] === '{') depth++;
    else if (tag[i] === '}' && --depth === 0) return tag.slice(tag.indexOf('{', start) + 1, i);
  }
  return null;
}

const MDX_MARKER = /^(import\s.+from\s+['"][^'"]+['"];?|export\s+const\s+\w+\s*=)/m;

export function isMdx(content: string): boolean {
  return MDX_MARKER.test(content);
}

/** Split out fenced code blocks so tag rewriting never touches code samples. */
function outsideFences(content: string, transform: (text: string) => string): string {
  return content.split(/(^```[\s\S]*?^```[^\n]*$)/m)
    .map((part, index) => index % 2 ? part : transform(part)).join('');
}

export function mdxToMarkdown(content: string, title?: string): string {
  if (!isMdx(content)) return content;
  const scope = new Map<string, Literal>();

  // 1. Collect and remove top-level constants. Later constants may spread earlier ones.
  let text = content.replace(/\r\n/g, '\n');
  for (;;) {
    const match = /^(?:export\s+)?const\s+(\w+)\s*=\s*/m.exec(text);
    if (!match) break;
    const parser = new LiteralParser(text.slice(match.index + match[0].length), scope);
    let end: number;
    try {
      scope.set(match[1], parser.parse());
      end = match.index + match[0].length + parser.index;
    } catch {
      // Unparseable constant: drop the line that declares it and keep the rest.
      end = text.indexOf('\n', match.index);
    }
    if (text[end] === ';') end++;
    text = text.slice(0, match.index) + text.slice(end);
  }

  return outsideFences(text, part => {
    let out = part.replace(/^import\s.+from\s+['"][^'"]+['"];?[ \t]*\n?/gm, '');
    // 2. Replace self-closing components in order of appearance.
    const component = /<(ParamsTable|ApiExample|ApiTester)\b/g;
    let match: RegExpExecArray | null;
    while ((match = component.exec(out))) {
      const end = jsxEnd(out, match.index);
      if (end < 0) break;
      const tag = out.slice(match.index, end);
      let replacement = '';
      if (match[1] === 'ParamsTable') {
        const ref = ['parameters', 'responseElements', 'data'].map(name => attribute(tag, name)).find(Boolean)?.trim();
        const data = ref ? scope.get(ref) ?? (() => {
          try { return new LiteralParser(ref, scope).parse(); } catch { return null; }
        })() : null;
        const heading = [...out.slice(0, match.index).matchAll(/^#{1,6}\s+(.+)$/gm)].at(-1)?.[1]?.trim();
        const lead = `**${[title, heading].filter(Boolean).join(': ') || 'Parameters'}**`;
        replacement = data ? renderTable(data, lead) : '';
      } else if (match[1] === 'ApiExample') {
        const parse = (name: string) => {
          const value = attribute(tag, name);
          if (!value) return null;
          try { return new LiteralParser(value, scope).parse(); } catch { return null; }
        };
        replacement = [renderHttp(parse('request'), 'request'), renderHttp(parse('response'), 'response')]
          .filter(Boolean).join('\n\n');
      }
      out = out.slice(0, match.index) + replacement + out.slice(end);
      component.lastIndex = match.index + replacement.length;
    }
    // 3. Tabs only group content. Keep each tab's label as a bold line.
    out = out.replace(/^[ \t]*<TabItem\b[^>]*?\blabel=["']([^"']+)["'][^>]*>[ \t]*$/gm, '**$1**')
      .replace(/^[ \t]*<\/?(Tabs|TabItem)\b[^>]*>[ \t]*$/gm, '');
    return out.replace(/\n{3,}/g, '\n\n');
  }).trim() + '\n';
}
