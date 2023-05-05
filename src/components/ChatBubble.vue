<script setup lang="ts">
import type { CSSProperties } from 'vue'
import MarkdownIt from 'markdown-it'
import { ref } from 'vue'

const props = defineProps<{
	from: 'system' | 'user' | 'assistant'
	content: string
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

const md = MarkdownIt({
	breaks: true,
})
</script>

<template>
	<div
		class="bubble"
		:style="bubbleStyle"
		v-html="md.render(props.content)"
	></div>
</template>

<style>
.bubble {
	padding: .5rem 1rem;
	border: 1px solid #d6d6d6;
	margin: .5rem;
	line-height: 1.5;
	overflow-wrap: break-word;
	word-break: break-word;
	max-width: 85%;
}

.bubble p {
	margin-block-end: 0;
	margin-block-start: 0;
}
</style>
