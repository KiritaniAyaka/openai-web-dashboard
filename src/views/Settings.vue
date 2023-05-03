<script setup lang="ts">
import { NAlert, NInput, NSpace } from 'naive-ui'
import { useLocalStorage } from '@vueuse/core'

const key = useLocalStorage('key', '')
</script>

<template>
	<div class="setting p-4">
		<NSpace vertical>
			<NAlert
				title="Your key will not send to our server"
				type="info"
			>
				Your Key and chat record are saved at you browser. File and others are storaged on OpenAI server.
			</NAlert>
			<div>OpenAI Key:</div>
			<NInput
				v-model:value="key"
				type="text"
				size="large"
				placeholder="OpenAI key"
			/>
		</NSpace>
	</div>
</template>
