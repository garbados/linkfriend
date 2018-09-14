/* eslint-disable no-unused-vars */

export function getHumanDate (ms) {
  const date = new Date(ms)
  return date.toISOString()
}
