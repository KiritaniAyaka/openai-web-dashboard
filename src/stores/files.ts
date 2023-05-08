import { defineStore } from 'pinia'
import type { OpenAIFile } from 'openai'
import { Configuration, OpenAIApi } from 'openai'
import { useLocalStorage } from '@vueuse/core'
import { downloadBlob } from '../utils'
import { useOpenAI } from './openai_config'

export const useFilesStore = defineStore('files', {
	state: () => ({
		files: [] as OpenAIFile[],
	}),
	actions: {
		async refresh() {
			const openai = useOpenAI().value
			const response = await openai.listFiles()
			this.files.splice(0, this.files.length, ...response.data.data)
		},
		async upload(file: File) {
			// const openai = useOpenAI().value
			const openai = new OpenAIApi(new Configuration({
				apiKey: useLocalStorage('key', '').value,
				formDataCtor: CustomForm,
			}))
			await openai.createFile(file, 'fine-tune')
			await this.refresh()
		},
		async delete(id: string) {
			const openai = useOpenAI().value
			const response = await openai.deleteFile(id)
			this.refresh()
			return response.data.deleted
		},
		async download(id: string, filename: string) {
			const openai = useOpenAI().value
			const response = await openai.downloadFile(id)
			const file = new Blob([response.data], { type: 'application/jsonl' })
			downloadBlob(file, filename)
		},
	},
})

class CustomForm extends FormData {
	getHeaders() {
		return {}
	}
}
