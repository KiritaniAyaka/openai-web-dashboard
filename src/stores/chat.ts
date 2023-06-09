import { defineStore } from 'pinia'
import type { ChatCompletionRequestMessage, ChatCompletionResponseMessage, CreateChatCompletionRequest, CreateChatCompletionResponse } from 'openai'
import { useLocalStorage } from '@vueuse/core'
import { pick } from '../utils'
import { useOpenAI } from './openai_config'

export const avaliableModels = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301']

interface ChatSession {
	id: number
	memory: ChatCompletionResponseMessage[]
	history: ChatCompletionResponseMessage[]

	model: string
	temperature: number
	top_p: number

	attachedMessage: number

	typedContent: string
	title: string
}

export const useChatStore = defineStore('chat', {
	state: () => ({
		sessions: useLocalStorage('chat', [] as ChatSession[]),
		selectedId: null as null | number,
		lastResponse: {} as CreateChatCompletionResponse,
	}),
	getters: {
		isEmpty(): boolean {
			return !this.current
		},
		/**
		 * get current Chat Session
		 */
		current(state): ChatSession | undefined {
			return state.sessions.find(session => session.id === state.selectedId)
		},
		attachedMessages(): ChatCompletionRequestMessage[] {
			const cur = this.current
			if (!cur) {
				return []
			}
			return cur.history.filter((_, index, arr) => arr.length - index <= cur.attachedMessage)
		},
	},
	actions: {
		async submit() {
			if (!this.current || !this.current.typedContent) {
				return
			}
			const requestOption = {
				...pick(this.current, ['model', 'temperature', 'top_p']),
				messages: [
					...this.attachedMessages,
					{
						role: 'user',
						content: this.current.typedContent,
					},
				],
			} as CreateChatCompletionRequest

			this.current.history.push({
				role: 'user',
				content: this.current.typedContent,
			})
			this.current.typedContent = ''

			const openai = useOpenAI().value
			// TODO: add attached message
			const response = await openai.createChatCompletion(requestOption)

			this.lastResponse = response.data
			this.current.history.push(response.data.choices[0].message!)
		},
		/**
		 * add a new session with default option
		 */
		addNewSession() {
			this.sessions.splice(0, 0, {
				id: new Date().getTime(),
				memory: [],
				history: [],
				model: 'gpt-3.5-turbo',
				temperature: 0.7,
				top_p: 1,
				attachedMessage: 5,
				typedContent: '',
				title: 'New Chat',
			})
		},
		deleteById(id?: number) {
			if (id === undefined) {
				return false
			}
			this.sessions = this.sessions.filter(item => item.id !== id)
			return true
		},
	},
})
