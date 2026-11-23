<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'dashboard'">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </template>

    <template v-else-if="name === 'clipboard'">
      <path d="M9 4.5h6M9 3h6a1.5 1.5 0 0 1 1.5 1.5V6H7.5V4.5A1.5 1.5 0 0 1 9 3Z" />
      <path d="M7.5 5H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18 5h-1.5" />
      <path d="M8.5 11h7M8.5 15h4.5" />
    </template>

    <template v-else-if="name === 'home'">
      <path d="M4 10.5 12 3.5l8 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-4.5h4V20" />
    </template>

    <template v-else-if="name === 'database'">
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </template>

    <template v-else-if="name === 'logout'">
      <path d="M14 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H14" />
      <path d="M16.5 8.5 20 12l-3.5 3.5" />
      <path d="M10 12h10" />
    </template>

    <template v-else-if="name === 'eye'">
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </template>

    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </template>

    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>

    <template v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" />
    </template>

    <template v-else-if="name === 'chevron-left'">
      <path d="m14 6-6 6 6 6" />
    </template>

    <template v-else-if="name === 'chevron-right'">
      <path d="m10 6 6 6-6 6" />
    </template>

    <template v-else-if="name === 'table'">
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M9.5 9.5V20" />
    </template>

    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>

    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </template>

    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </template>
  </svg>
</template>
