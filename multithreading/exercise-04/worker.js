import { createHash, randomBytes } from 'node:crypto'

export default function () {
  const bytes = randomBytes(1e9)
  return createHash('sha256').update(bytes).digest('hex')
}
