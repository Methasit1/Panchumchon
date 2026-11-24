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

    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </template>

    <template v-else-if="name === 'moon'">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </template>

    <template v-else-if="name === 'home'">
      <path d="M4 10.5 12 3.5l8 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-4.5h4V20" />
    </template>

    <template v-else-if="name === 'seal-check'">
      <path
        d="M12 2.6l2.06 1.5 2.56-.1.88 2.41 2.15 1.39-.79 2.44.79 2.44-2.15 1.39-.88 2.41-2.56-.1L12 21.4l-2.06-1.5-2.56.1-.88-2.41-2.15-1.39.79-2.44-.79-2.44 2.15-1.39.88-2.41 2.56.1L12 2.6Z"
      />
      <path d="m9.1 12.2 2 2 3.8-4" />
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

    <template v-else-if="name === 'pin'">
      <path d="M12 21s6.5-5.3 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.7 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.4" />
    </template>

    <template v-else-if="name === 'layers'">
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </template>

    <template v-else-if="name === 'lock'">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </template>

    <template v-else-if="name === 'dots'">
      <circle cx="5.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </template>

    <template v-else-if="name === 'close'">
      <path d="m6 6 12 12M18 6 6 18" />
    </template>
  </svg>
</template>
