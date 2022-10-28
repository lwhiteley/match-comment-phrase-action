export const resolveBooleanInput = (
  value = '',
  defaultValue = false
): boolean => {
  const input = value ?? defaultValue
  return input?.toString()?.toLowerCase() === 'true'
}
