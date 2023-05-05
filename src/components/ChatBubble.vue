<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
	from: 'system' | 'user' | 'assistant'
}>()

const radius = '1.25rem'
const base = `${radius} ${radius}`
const stylePresets: { [P in 'system' | 'user' | 'assistant']: CSSProperties } = {
	user: {
		backgroundColor: '#36ad6a33',
		borderRadius: `${base} 0 ${radius}`,
		alignSelf: 'end',
		width: 'fit-content',
	},
	assistant: {
		backgroundColor: '#ececec88',
		borderRadius: `${base} ${radius} 0`,
		alignSelf: 'start',
		width: 'fit-content',
	},
	system: {
		backgroundColor: '#ececec55',
		borderRadius: radius,
		alignSelf: 'stretch',
		textAlign: 'center',
	},
}

const bubbleStyle = ref(stylePresets[props.from])
</script>

<template>
	<div
		class="bubble"
		:style="bubbleStyle"
	>
		<slot></slot>
	</div>
</template>

<style scoped>
.bubble {
	padding: .5rem 1rem;
	border: 1px solid #d6d6d6;
	margin: .5rem;
	line-height: 1.5;
	overflow-wrap: break-word;
	word-break: break-word;
	max-width: 85%;
}
</style>
