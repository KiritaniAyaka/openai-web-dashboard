import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { CreateEditRequest, CreateEditResponse } from 'openai'
import { useOpenAI } from './openai_config'

export const avaliableModels = ['text-davinci-edit-001', 'code-davinci-edit-001']

type NullableEditOption = Required<CreateEditRequest>

export type EditOption = {
	[P in keyof NullableEditOption]-?: NonNullable<NullableEditOption[P]>;
}

export const useEditStore = defineStore('edit', {
	state: () => ({
		option: useLocalStorage(
			'edit_option',
			{ model: 'text-davinci-edit-001', n: 1, temperature: 0.7, top_p: 1 } as EditOption,
			{
				mergeDefaults(storageValue, defaults) {
					return { ...defaults, ...storageValue }
				},
			},
		),
		lastResponse: {} as CreateEditResponse,
	}),
	actions: {
		async submit() {
			const openai = useOpenAI().value
			const response = await openai.createEdit(this.option)
			this.lastResponse = response.data
		},
	},
})
