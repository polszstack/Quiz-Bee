const htmlEntities: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

export function cleanAnswerText(text: string): string {
  return text.replace(/&(?:#(x[\da-f]+|\d+)|([a-z]+));/gi, (entity, numeric, named) => {
    if (named) return htmlEntities[named.toLowerCase()] ?? entity

    const codePoint = numeric.toLowerCase().startsWith('x')
      ? Number.parseInt(numeric.slice(1), 16)
      : Number.parseInt(numeric, 10)

    return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint)
  })
}


