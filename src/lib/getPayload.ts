import configPromise from '@payload-config'
import { getPayload as _getPayload } from 'payload'

let cached: ReturnType<typeof _getPayload> | null = null

export async function getPayload() {
  if (!cached) {
    cached = _getPayload({ config: configPromise })
  }
  return cached
}
