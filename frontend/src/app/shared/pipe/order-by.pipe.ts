import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  standalone: true,
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform<T>(array: T[], field: keyof T, reverse = false): T[] {
    if (!array || !field) return array

    return [...array].sort((a, b) => {
      const aValue = a[field]
      const bValue = b[field]

      if (aValue > bValue) return reverse ? -1 : 1
      if (aValue < bValue) return reverse ? 1 : -1
      return 0
    })
  }
}
