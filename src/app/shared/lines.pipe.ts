import { Pipe, PipeTransform } from '@angular/core';

/**
 * Splits text on its line breaks so each written line can be its own block. Poems use this
 * with a hanging indent, so a line that wraps on a narrow screen stays visibly distinct from
 * the line breaks Gary wrote.
 */
@Pipe({ name: 'lines' })
export class LinesPipe implements PipeTransform {
  transform(text: string | null | undefined): string[] {
    return text ? text.split('\n') : [];
  }
}
