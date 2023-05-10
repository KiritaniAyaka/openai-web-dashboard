<script setup lang="ts">
import { NIcon, NInput } from 'naive-ui'
import { Delete20Filled as DeleteIcon, Edit16Filled as EditIcon } from '@vicons/fluent'
import { ref } from 'vue'

const props = defineProps<{
	modelValue: string
	selected?: boolean
}>()

const emit = defineEmits<{
	(e: 'click'): void
	(e: 'delete'): void
	(e: 'update:modelValue', value: string): void
}>()

const editMode = ref(false)
const internalValue = ref('')

const edit = () => {
	editMode.value = true
	internalValue.value = props.modelValue
}

const del = () => {
	emit('delete')
}

const save = () => {
	emit('update:modelValue', internalValue.value)
	editMode.value = false
}
</script>

<template>
	<div
		class="chat-session flex box-border rounded-2 items-center select-none px-3"
		:class="{ selected }"
		@click="emit('click')"
	>
		<div
			v-if="!editMode"
			class="font-bold truncate grow flex items-center"
		>
			<span class="grow truncate">{{ props.modelValue }}</span>
			<NIcon
				v-if="selected"
				size="18"
				@click="edit"
			>
				<EditIcon></EditIcon>
			</NIcon>
			<NIcon
				v-if="selected"
				size="18"
				class="ml-1"
				@click="del"
			>
				<DeleteIcon></DeleteIcon>
			</NIcon>
		</div>
		<NInput
			v-else
			v-model:value="internalValue"
			size="small"
			autofocus
			@click.stop=""
			@blur="save()"
			@keydown.enter="save()"
		></NInput>
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
