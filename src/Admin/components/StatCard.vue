<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: 0 },
  unit: { type: String, default: '' },
  hint: { type: String, default: '' },
  dot: { type: String, default: '' },
  accent: { type: Boolean, default: false },
})
</script>

<template>
  <article
    :class="[
      'relative rounded-[12px] border bg-white px-4 pb-3 pt-3',
      accent
        ? 'border-[#1D5C48] shadow-[0_0_0_1px_rgba(29,92,72,0.12)]'
        : 'border-[#BFC9C3]/70',
    ]"
  >
    <div class="flex items-start justify-between gap-2">
      <p
        :class="[
          'text-[12px] leading-[17px]',
          accent ? 'font-medium text-[#1D5C48]' : 'text-[#505F76]',
        ]"
      >
        {{ label }}
      </p>
      <span v-if="dot" :class="['mt-[5px] h-[7px] w-[7px] shrink-0 rounded-full', dot]" />
    </div>

    <p class="mt-[10px] flex items-baseline gap-1">
      <span
        :class="[
          'font-semibold leading-none tracking-tight',
          accent ? 'text-[24px]' : 'text-[26px]',
        ]"
      >
        {{ value }}
      </span>
      <span v-if="unit" class="text-[11px] leading-none text-[#505F76]">{{ unit }}</span>
    </p>

    <p v-if="hint" class="mt-[6px] text-[10px] leading-none text-[#505F76]">{{ hint }}</p>
  </article>
</template>
