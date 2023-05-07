<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormItemRule, FormRules } from 'naive-ui'
import { NDynamicInput, NForm, NFormItemGi, NGrid, NInput, NInputNumber, NModal, NSelect, NSwitch, useMessage } from 'naive-ui'

import { useFilesStore } from '../../stores/files'
import { useFineTuneStore } from '../../stores/fine_tune'

const props = defineProps<{
	show: boolean
}>()

const emit = defineEmits<{
	(e: 'update:show', value: boolean): void
}>()

const filesStore = useFilesStore()
const fineTuneStore = useFineTuneStore()

const msg = useMessage()

onMounted(() => filesStore.refresh())

export interface FineTuneModel {
	training_file?: string
	validation_file?: string
	model: string
	suffix: string
	n_epochs: number
	batch_size?: number
	learning_rate_multiplier?: number
	prompt_loss_weight?: number
	compute_classification_metrics?: boolean
	classification_n_classes?: number
	classification_positive_class?: string
	classification_betas?: number[]
}

const model = reactive<FineTuneModel>({
	training_file: undefined,
	validation_file: undefined,
	model: 'curie',
	suffix: '',
	n_epochs: 4,
	batch_size: undefined,
	learning_rate_multiplier: undefined,
	prompt_loss_weight: undefined,
	compute_classification_metrics: undefined,
	classification_n_classes: undefined,
	classification_positive_class: undefined,
	classification_betas: undefined,
})

const rules: FormRules = {
	training_file: {
		required: true,
		trigger: ['blur', 'update', 'input'],
		message: 'Please choose a file',
	},
	validation_file: {
		validator(_rule: FormItemRule, value: string | undefined) {
			if (value && value === model.training_file) {
				return new Error('The validation data should be mutually exclusive with training data')
			}
			return true
		},
		trigger: ['blur', 'update', 'input'],
	},
	model: {
		required: true,
		trigger: ['blur', 'update', 'input'],
	},
}

const fileSelectOptions = computed(() => filesStore.files.map(item => ({
	label: item.filename,
	value: item.id,
})))

const avaliableModels = ['davinci', 'curie', 'babbage', 'ada']

const modelSelectOptions = computed(() => avaliableModels.map(item => ({
	label: item,
	value: item,
})))

const enableClassification = ref(false)
const dialogLoading = ref(false)

const create = async () => {
	dialogLoading.value = true
	try {
		await fineTuneStore.create(model)
		msg.success('Fine tune created')
	} catch (error) {
		console.error(error)
		msg.error('Create failed')
	}
	dialogLoading.value = false
	emit('update:show', false)
}
</script>

<template>
	<NModal
		:mask-closable="false"
		:show="props.show"
		preset="dialog"
		:closable="false"
		:show-icon="false"
		title="Create a fine tune"
		positive-text="Create"
		negative-text="Cancel"
		style="width: 800px;"
		:loading="dialogLoading"
		@negative-click="emit('update:show', false)"
		@positive-click="create"
		@update:show="(value) => emit('update:show', value)"
	>
		<NForm
			label-placement="left"
			label-width="auto"
			require-mark-placement="right"
			:rules="rules"
			:model="model"
		>
			<NGrid
				:cols="2"
				:x-gap="16"
			>
				<NFormItemGi
					label="Training File"
					path="training_file"
					:span="2"
				>
					<NSelect
						v-model:value="model.training_file"
						:options="fileSelectOptions"
						scrollable
						trigger="click"
					>
					</NSelect>
				</NFormItemGi>

				<NFormItemGi
					label="Validation File"
					path="validation_file"
					:span="2"
				>
					<NSelect
						v-model:value="model.validation_file"
						:options="fileSelectOptions"
						scrollable
						clearable
						trigger="click"
					>
					</NSelect>
				</NFormItemGi>

				<NFormItemGi
					label="Model"
					path="model"
					first
				>
					<NSelect
						v-model:value="model.model"
						:options="modelSelectOptions"
					></NSelect>
				</NFormItemGi>

				<NFormItemGi
					label="N Epochs"
					path="n_epochs"
				>
					<NInputNumber
						v-model:value="model.n_epochs"
						:precision="0"
						:validator="(n: number) => n > 0"
						placeholder="Defaults to 4"
					></NInputNumber>
				</NFormItemGi>

				<NFormItemGi
					label="Suffix"
					path="suffix"
				>
					<NInput
						v-model:value="model.suffix"
						placeholder="Defaults to null"
					></NInput>
				</NFormItemGi>

				<NFormItemGi
					label="Batch Size"
					path="batch_size"
				>
					<NInputNumber
						v-model:value="model.batch_size"
						placeholder="Defaults to null"
					></NInputNumber>
				</NFormItemGi>

				<NFormItemGi
					label="Learning Rate Multiplier"
					path="learning_rate_multiplier"
				>
					<NInputNumber
						v-model:value="model.learning_rate_multiplier"
						placeholder="Defaults to null"
					>
					</NInputNumber>
				</NFormItemGi>

				<NFormItemGi
					label="Prompt Loss Weight"
					path="prompt_loss_weight"
				>
					<NInputNumber
						v-model:value="model.prompt_loss_weight"
						placeholder="Defaults to 0.01"
					>
					</NInputNumber>
				</NFormItemGi>

				<NFormItemGi label="Classification">
					<NSwitch v-model:value="enableClassification"></NSwitch>
				</NFormItemGi>

				<NFormItemGi
					:class="{ 'display-none': !enableClassification }"
					label="Compute Metrics"
					path="compute_classification_metrics"
				>
					<NSwitch v-model:value="model.compute_classification_metrics"></NSwitch>
				</NFormItemGi>

				<NFormItemGi
					:class="{ 'display-none': !enableClassification }"
					label="N Classes"
					path="classification_n_classes"
				>
					<NInputNumber
						v-model:value="model.classification_n_classes"
						placeholder="Defaults to null"
					></NInputNumber>
				</NFormItemGi>

				<NFormItemGi
					:class="{ 'display-none': !enableClassification }"
					label="Positive Class"
					path="classification_positive_class"
				>
					<NInput
						v-model:value="model.classification_positive_class"
						placeholder="Defaults to null"
					></NInput>
				</NFormItemGi>

				<NFormItemGi
					:class="{ 'display-none': !enableClassification }"
					label="Betas"
					path="classification_betas"
					:span="2"
				>
					<NDynamicInput
						v-model:value="model.classification_betas"
						:min="0"
					></NDynamicInput>
				</NFormItemGi>
			</NGrid>
		</NForm>
	</NModal>
</template>
