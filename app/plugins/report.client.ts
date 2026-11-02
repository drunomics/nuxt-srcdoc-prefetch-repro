// Reports the outcome of client init to the parent page and the console.
export default defineNuxtPlugin((nuxtApp) => {
  const inFrame = window.location.protocol === 'about:'
  const report = (status: string, detail = '') => {
    console.log(`[repro] ${inFrame ? 'iframe' : 'top'}: ${status} ${detail}`.trim())
    if (inFrame) window.parent.postMessage({ repro: status, detail }, '*')
  }
  const describe = (e: any) => [e?.statusCode, e?.statusMessage, e?.message, e?.stack?.split('\n').slice(0, 4).join(' | ')].filter(Boolean).join(' / ')
  nuxtApp.hook('app:mounted', () => report('mounted'))
  nuxtApp.hook('app:error', (err: any) => report('error', describe(err?.cause ?? err)))
})
