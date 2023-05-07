<script setup lang="ts">
import { NAlert, NInput, NSpace } from 'naive-ui'
import { useLocalStorage } from '@vueuse/core'
import LayoutSkeleton from '../components/LayoutSkeleton.vue'

const key = useLocalStorage('key', '')
</script>

<template>
	<LayoutSkeleton title="Settings">
		<NSpace vertical>
			<NAlert
				title="We will not keep your data"
				type="info"
			>
				All data is stored locally and on OpenAI servers.
			</NAlert>
			<div>OpenAI Key:</div>
			<NInput
				v-model:value="key"
				type="text"
				size="large"
				placeholder="OpenAI key"
			/>
		</NSpace>
	</LayoutSkeleton>
</template>
