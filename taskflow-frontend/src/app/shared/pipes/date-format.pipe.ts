import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | null | undefined, style: 'relative' | 'short' | 'full' = 'relative'): string {
    if (!value) return '';
    const date = parseISO(value);
    if (style === 'relative') return formatDistanceToNow(date, { addSuffix: true });
    if (style === 'short') return format(date, 'MMM d');
    return format(date, 'MMM d, yyyy');
  }
}
