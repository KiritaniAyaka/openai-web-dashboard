<script setup lang="ts">
import { NDivider, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider } from 'naive-ui'
import type { CSSProperties } from 'vue'

const props = defineProps({
	title: {
		type: String,
	},
	hasSider: {
		type: Boolean,
		default: false,
	},
})

const contentStyle: CSSProperties = { marginRight: '1.5rem', padding: '1rem' }
const siderContentStyle: CSSProperties = { overflow: 'hidden', padding: '24px', whiteSpace: 'nowrap', height: '100vh' }
</script>

<template>
	<NLayout>
		<NLayoutHeader class="p-2 flex items-center">
			<div class="px-4 text-lg font-bold grow">
				{{ props.title }}
			</div>
			<slot name="titleExtra"></slot>
		</NLayoutHeader>
		<NDivider />
		<NLayoutContent
			v-if="!props.hasSider"
			:content-style="contentStyle"
		>
			<slot name="default"></slot>
		</NLayoutContent>
		<NLayout
			v-else
			has-sider
			sider-placement="right"
		>
			<NLayoutContent :content-style="contentStyle">
				<slot name="default"></slot>
			</NLayoutContent>
			<NLayoutSider
				collapse-mode="width"
				:collapsed-width="24"
				:width="240"
				:native-scrollbar="true"
				show-trigger="arrow-circle"
				bordered
				:content-style="siderContentStyle"
			>
				<slot name="sider"></slot>
			</NLayoutSider>
		</NLayout>
	</NLayout>
</template>

<style scoped>
:deep(.n-layout-header) {
	height: 50px;
}

:deep(.n-divider) {
	margin: 0;
}
</style>
