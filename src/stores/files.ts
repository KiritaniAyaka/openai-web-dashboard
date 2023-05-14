import { defineStore } from 'pinia'
import type { OpenAIFile } from 'openai'
import { Configuration, OpenAIApi } from 'openai'
import { useLocalStorage } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import { downloadBlob } from '../utils'
import { useOpenAI } from './openai_config'

const { message: msg, loadingBar: loading } = createDiscreteApi(['message', 'loadingBar'])

export const useFilesStore = defineStore('files', {
	state: () => ({
		files: [] as OpenAIFile[],
	}),
	getters: {
		sortedFiles: (state) => {
			return state.files.sort((a, b) => b.created_at - a.created_at)
		},
	},
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
			loading.start()
			try {
				const response = await openai.downloadFile(id)
				const file = new Blob([response.data], { type: 'application/jsonl' })
				downloadBlob(file, filename)
				loading.finish()
			} catch (error: any) {
				const message = error.response.data.error.message as string
				msg.error(message, { keepAliveOnHover: true })
				loading.error()
			}
		},
	},
})

class CustomForm extends FormData {
	getHeaders() {
		return {}
	}
}
