<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { NButton, NCard, NGi, NGrid, NIcon, NLayout, NLayoutContent, NLayoutHeader, NSpace, NText, useDialog, useLoadingBar, useMessage } from 'naive-ui'
import { FileTrayFullOutline as FileIcon } from '@vicons/ionicons5'
import copy from 'copy-to-clipboard'
import { humanizeFileSize } from '../utils'
import { useFilesStore } from '../stores/files'

const filesStore = useFilesStore()

const msg = useMessage()
const loadingBar = useLoadingBar()

const fileRef: Ref<HTMLInputElement | undefined> = ref()

onMounted(() => {
	filesStore.refresh()
})

function selectFile() {
	if (!fileRef.value) {
		return
	}
	fileRef.value.click()
}

async function upload() {
	if (!fileRef.value || !fileRef.value.files || fileRef.value.files.length <= 0) {
		return
	}
	loadingBar.start()
	const file = fileRef.value.files[0]
	try {
		await filesStore.upload(file)
		loadingBar.finish()
		msg.success('File uploaded')
	} catch (error) {
		loadingBar.error()
		msg.error('Uploading failed')
	}
}

function copyID(id: string) {
	copy(id)
	msg.success('Copied id to clipboard')
}

const dialog = useDialog()

function deleteFile(id: string) {
	const d = dialog.warning({
		title: 'Warning',
		content: 'Do you want to delete this file? It\'s UNRECOVERABLE!',
		positiveText: 'Delete',
		negativeText: 'Cancel',
		onPositiveClick: async () => {
			d.loading = true
			if (await filesStore.delete(id)) {
				msg.success('File deleted successfully')
			} else {
				msg.error('Failed to delete the file')
			}
			d.loading = false
		},
	})
}
</script>

<template>
	<NLayout>
		<NLayoutHeader class="p-2 flex flex-row items-center">
			<div class="px-4 text-lg font-bold grow">
				Files
			</div>
			<NButton
				round
				type="primary"
				class="mr-4"
				@click="selectFile"
			>
				<template #icon>
					<NIcon><FileIcon /></NIcon>
				</template>
				Upload
			</NButton>
			<input
				ref="fileRef"
				type="file"
				class="display-none"
				accept=".jsonl"
				@change.prevent="upload"
			/>
		</NLayoutHeader>
		<NLayoutContent
			:content-style="{ padding: '24px' }"
		>
			<NGrid
				:cols="2"
				x-gap="32"
			>
				<NGi
					v-for="item in filesStore.files"
					:key="item.id"
				>
					<NCard
						size="small"
						:title="item.filename"
						:header-style="{}"
						hoverable
					>
						<template #header-extra>
							<NText
								code
								@click="copyID(item.id)"
							>
								{{ item.id }}
							</NText>
						</template>
						<NSpace vertical>
							<div>
								Size: <NText code>
									{{ humanizeFileSize(item.bytes) }}
								</NText>
							</div>
							<div>
								Create time: <NText code>
									{{ new Date(item.created_at * 1000).toLocaleString() }}
								</NText>
							</div>
						</NSpace>
						<template #action>
							<div class="text-right">
								<NButton
									type="error"
									secondary
									@click="deleteFile(item.id)"
								>
									Delete
								</NButton>
							</div>
						</template>
					</NCard>
				</NGi>
			</NGrid>
		</NLayoutContent>
	</NLayout>
</template>

<style scoped>
:deep(.n-card .n-card-header .n-card-header__main),
:deep(.n-card .n-card-header .n-card-header__extra) {
	cursor: default;
}

:deep(.n-card .n-card-header .n-card-header__main:hover),
:deep(.n-card .n-card-header .n-card-header__extra:hover) {
	text-decoration: underline;
}
</style>
