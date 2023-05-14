import { defineStore } from 'pinia'
import type { FineTune } from 'openai'
import type { FineTuneModel } from '../views/dialog/CreateFineTuneDialog.vue'
import { removeFalsy } from '../utils'
import { useOpenAI } from './openai_config'

export const useFineTuneStore = defineStore('fine_tune', {
	state: () => ({
		fineTunes: [] as FineTune[],
	}),
	getters: {
		sortedFileTunes: (state) => {
			return state.fineTunes.sort((a, b) => b.created_at - a.created_at)
		},
	},
	actions: {
		async refresh() {
			const openai = useOpenAI().value
			const response = await openai.listFineTunes()
			this.fineTunes = response.data.data
		},
		async create(param: FineTuneModel) {
			const openai = useOpenAI().value
			if (!param.training_file) {
				return false
			}
			await openai.createFineTune({
				...removeFalsy(param),
				training_file: param.training_file,
			})
			await this.refresh()
		},
	},
})
