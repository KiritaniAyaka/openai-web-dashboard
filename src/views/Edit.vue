<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from 'naive-ui'
import { NButton, NInput, NInputNumber, NLayout, NLayoutContent, NLayoutSider, NSelect, NSlider, NSpace } from 'naive-ui'
import { avaliableModels, useEditStore } from '../stores/edit'

const editStore = useEditStore()

const selectOption = computed(() => (avaliableModels.map(v => ({
	label: v,
	value: v,
}) as SelectOption)))

async function submit() {
	await editStore.submit()
}
</script>

<template>
	<NLayout
		has-sider
		sider-placement="right"
	>
		<NLayoutContent :content-style="{ marginRight: '1.5rem', padding: '1rem' }">
			<NSpace
				vertical
				:item-style="{ padding: '.25rem' }"
			>
				<div>Input</div>
				<NInput
					v-model:value="editStore.option.input"
					type="textarea"
					placeholder="Input"
				></NInput>
				<div>Instruction</div>
				<NInput
					v-model:value="editStore.option.instruction"
					type="textarea"
					placeholder="Instruction"
				></NInput>
				<NButton @click="submit">
					Submit
				</NButton>
				<div class="flex">
					<span>Result</span>
					<span
						v-if="!!editStore?.lastResponse?.usage"
						class="grow text-right"
					>Last cost:
						{{ editStore.lastResponse.usage.prompt_tokens }}(propmt) +
						{{ editStore.lastResponse.usage.completion_tokens }}(completion) =
						{{ editStore.lastResponse.usage.total_tokens }} tokens
					</span>
				</div>
				<!-- Default display -->
				<NInput
					v-if="!editStore.lastResponse.choices"
					value="Result text will be here"
					type="textarea"
					placeholder="Result"
					:readonly="true"
				></NInput>
				<NInput
					v-for="item of editStore.lastResponse.choices"
					:key="item.index"
					:value="item.text"
					type="textarea"
					placeholder="Result"
					:readonly="true"
				></NInput>
			</NSpace>
		</NLayoutContent>
		<NLayoutSider
			collapse-mode="width"
			:collapsed-width="24"
			:width="240"
			:native-scrollbar="true"
			show-trigger="arrow-circle"
			bordered
			:content-style="{ overflow: 'hidden', padding: '24px', whiteSpace: 'nowrap', height: '100vh' }"
		>
			<NSpace
				vertical
				:item-style="{ padding: '.25rem' }"
			>
				<div>Model</div>
				<NSelect
					v-model:value="editStore.option.model"
					:options="selectOption"
				></NSelect>
				<div>n</div>
				<NInputNumber
					v-model:value="editStore.option.n"
					:precision="0"
					:validator="(n:number) => n > 0"
					:show-button="false"
					placeholder="n"
				></NInputNumber>
				<div class="flex">
					<span class="grow">Temperature</span>
					<span class="text-right">{{ editStore.option.temperature }}</span>
				</div>
				<NSlider
					v-model:value="editStore.option.temperature"
					:step="0.01"
					:tooltip="false"
					:max="1"
					:min="0"
				></NSlider>
				<div class="flex">
					<span class="grow">Top P</span>
					<span class="text-right">{{ editStore.option.top_p }}</span>
				</div>
				<NSlider
					v-model:value="editStore.option.top_p"
					:step="0.01"
					:tooltip="false"
					:max="1"
					:min="0"
				></NSlider>
			</NSpace>
		</NLayoutSider>
	</NLayout>
</template>
