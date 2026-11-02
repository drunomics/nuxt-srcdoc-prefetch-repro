<script setup lang="ts">
const status = ref('not started')
const frame = ref<HTMLIFrameElement>()

async function boot () {
  status.value = 'loading'
  // Boot this same app from its own HTML shell inside a srcdoc iframe.
  frame.value!.srcdoc = await (await fetch('/')).text()
}

onMounted(() => {
  window.addEventListener('message', (e) => {
    // Keep the first error: Nuxt still mounts the app after reporting it.
    if (e.data?.repro && !status.value.startsWith('error')) {
      status.value = `${e.data.repro} ${e.data.detail ?? ''}`.trim()
    }
  })
})
</script>

<template>
  <main>
    <h1>Nuxt app inside &lt;iframe srcdoc&gt;</h1>
    <button id="boot" @click="boot">Boot this app in a srcdoc iframe</button>
    <p>iframe status: <strong id="status">{{ status }}</strong></p>
    <iframe ref="frame" title="srcdoc" width="600" height="120" />
  </main>
</template>
