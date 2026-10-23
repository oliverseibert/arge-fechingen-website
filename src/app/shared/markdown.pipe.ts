import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

/** Markdown → HTML; Ausgabe über [innerHTML], dort sanitized Angular das Ergebnis. */
@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return marked.parse(value, { async: false, gfm: true, breaks: true });
  }
}
