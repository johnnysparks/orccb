/**
 * Minimal Markdown-to-HTML converter supporting the content format used by topic files.
 * Handles: headings, paragraphs, bold, italic, inline code, unordered/ordered lists, hr.
 */

export function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let listTag = '';
  let inParagraph = false;

  function closeList(): void {
    if (listTag) {
      out.push(`</${listTag}>`);
      listTag = '';
    }
  }

  function closeParagraph(): void {
    if (inParagraph) {
      out.push('</p>');
      inParagraph = false;
    }
  }

  function inline(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }

  for (const line of lines) {
    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      closeParagraph();
      closeList();
      out.push('<hr>');
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h1 || h2 || h3) {
      closeParagraph();
      closeList();
      const level = h1 ? 1 : h2 ? 2 : 3;
      const text = (h1 ?? h2 ?? h3)![1]!;
      out.push(`<h${level}>${inline(text)}</h${level}>`);
      continue;
    }

    // Unordered list item
    const ulMatch = line.match(/^[*-] (.+)/);
    if (ulMatch) {
      closeParagraph();
      if (listTag !== 'ul') {
        closeList();
        out.push('<ul>');
        listTag = 'ul';
      }
      out.push(`<li>${inline(ulMatch[1]!)}</li>`);
      continue;
    }

    // Ordered list item
    const olMatch = line.match(/^\d+\. (.+)/);
    if (olMatch) {
      closeParagraph();
      if (listTag !== 'ol') {
        closeList();
        out.push('<ol>');
        listTag = 'ol';
      }
      out.push(`<li>${inline(olMatch[1]!)}</li>`);
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      closeParagraph();
      closeList();
      continue;
    }

    // Paragraph text
    closeList();
    if (!inParagraph) {
      out.push(`<p>${inline(line)}`);
      inParagraph = true;
    } else {
      out.push(` ${inline(line)}`);
    }
  }

  closeParagraph();
  closeList();
  return out.join('\n');
}

/** Strip YAML frontmatter (--- ... ---) from a Markdown string. */
export function stripFrontmatter(raw: string): string {
  if (!raw.startsWith('---')) return raw;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return raw;
  return raw.slice(end + 4).trimStart();
}
