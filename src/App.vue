<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()
const themeColor = computed(() => colorMode.value === 'dark' ? '#0c1222' : '#f0f9ff')

useHead({
  title: 'Планувальник подорожей',
  meta: [
    { name: 'theme-color', content: themeColor },
    { name: 'description', content: 'Vue 3 застосунок для планування подорожей з Pinia та localStorage' }
  ]
})
</script>

<template>
  <Suspense>
    <UApp>
      <UHeader class="border-b border-default/60 bg-default/80 backdrop-blur-md">
        <template #left>
          <RouterLink to="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <AppLogo class="h-7 w-auto shrink-0" />
            <span class="hidden bg-gradient-to-r from-primary to-info bg-clip-text font-semibold text-transparent sm:inline">
              Планувальник подорожей
            </span>
          </RouterLink>
        </template>

        <template #right>
          <UColorModeButton />
        </template>
      </UHeader>

      <UMain class="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-elevated/30 to-default">
        <RouterView />
      </UMain>

      <UFooter class="border-t border-default/60">
        <template #left>
          <p class="text-sm text-muted">
            Vue 3 · Nuxt UI · Pinia · localStorage · {{ new Date().getFullYear() }}
          </p>
        </template>
      </UFooter>
    </UApp>
  </Suspense>
</template>
