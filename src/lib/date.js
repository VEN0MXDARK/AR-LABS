/* Renders in the visitor's own locale/format via Intl, not a hardcoded string. */
export function formatBlogDate(isoDate) {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    .format(new Date(`${isoDate}T00:00:00`))
    .toUpperCase()
}
