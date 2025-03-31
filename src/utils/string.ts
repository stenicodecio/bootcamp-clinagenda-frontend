export const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export const clearMask = (text: string) => {
  return text.replace(/[\.,\,,\-,\\,\/,\(,\),\:]/g, '')
}
