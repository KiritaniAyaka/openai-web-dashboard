<script setup lang="ts">
const props = defineProps<{
	title: string
	selected?: boolean
}>()

const emit = defineEmits<{
	(e: 'click'): void
}>()
</script>

<template>
	<div
		class="chat-session flex box-border rounded-2 items-center select-none"
		:class="{ selected }"
		@click="emit('click')"
	>
		<div class="font-bold mx-3 truncate">
			{{ props.title }}
		</div>
	</div>
</template>

<style scoped>
.chat-session {
	height: 48px;
	background-color: #ececec66;
	transition: .3s;
}

.chat-session:hover {
	background-color: #ecececec;
}

.selected {
	background-color: #ececec;
}

.selected:hover {
	background-color: #ececec;
}
</style>
