import type { RouterConfig } from 'nuxt/schema'
import { createMemoryHistory } from 'vue-router'

// Inside an <iframe srcdoc> the location is about:srcdoc, so web history
// cannot be used. Page-builder previews switch to memory history the same way.
export default {
  history: base => (import.meta.client && window.location.protocol === 'about:')
    ? createMemoryHistory(base)
    : undefined,
} satisfies RouterConfig
