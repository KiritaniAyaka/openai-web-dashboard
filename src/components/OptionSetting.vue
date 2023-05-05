<script setup lang="ts">
const props = defineProps<{
	title: string
	value?: string | number
}>()
</script>

<template>
	<div class="pb-3">
		<div
			v-if="value !== undefined"
			class="flex pb-3"
		>
			<span class="grow">{{ props.title }}</span>
			<span class="text-right">{{ props.value }}</span>
		</div>
		<div
			v-else
			class="pb-3"
		>
			{{ props.title }}
		</div>
		<slot></slot>
	</div>
</template>
