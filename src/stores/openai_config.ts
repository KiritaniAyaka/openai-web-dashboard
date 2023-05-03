import { useLocalStorage } from '@vueuse/core'
import { Configuration, OpenAIApi } from 'openai'
import { computed } from 'vue'

export function useOpenAI() {
	const key = useLocalStorage('key', '')
	return computed(() => new OpenAIApi(new Configuration({ apiKey: key.value })))
}
