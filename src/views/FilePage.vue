<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { NButton, NCard, NGi, NGrid, NIcon, NSpace, NText, NTime, useDialog, useLoadingBar, useMessage } from 'naive-ui'
import { FileTrayFullOutline as FileIcon } from '@vicons/ionicons5'
import { copyAndShowMessage, humanizeFileSize } from '../utils'
import { useFilesStore } from '../stores/files'
import LayoutSkeleton from '../components/LayoutSkeleton.vue'

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
	<LayoutSkeleton title="Files">
		<template #titleExtra>
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
		</template>

		<NGrid
			:cols="3"
			x-gap="16"
			y-gap="16"
		>
			<NGi
				v-for="item in filesStore.files"
				:key="item.id"
			>
				<NCard
					size="small"
					hoverable
				>
					<template #header>
						<span class="cursor-default hover:underline">{{ item.filename }}</span>
					</template>
					<template #header-extra>
						<NText
							code
							class="cursor-default hover:underline"
							@click="copyAndShowMessage(item.id, msg, 'Copied id to clipboard')"
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
								<NTime
									:time="item.created_at"
									unix
								></NTime>
							</NText>
						</div>
					</NSpace>
					<template #action>
						<div class="text-right">
							<NButton
								type="info"
								secondary
								@click="filesStore.download(item.id, item.filename)"
							>
								Download
							</NButton>
							<NButton
								type="error"
								secondary
								class="ml-2"
								@click="deleteFile(item.id)"
							>
								Delete
							</NButton>
						</div>
					</template>
				</NCard>
			</NGi>
		</NGrid>
	</LayoutSkeleton>
</template>
