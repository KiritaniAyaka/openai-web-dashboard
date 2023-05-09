<script setup lang="ts">
import { NButton, NCard, NGi, NGrid, NIcon, NSpace, NTag, NText, NTime, useMessage } from 'naive-ui'
import {
	AddCircleOutline as AddIcon,
	SyncOutline as PendingIcon,
	RefreshOutline as RunningIcon,
	CheckmarkCircle as SuccessIcon,
} from '@vicons/ionicons5'
import { onMounted, ref } from 'vue'
import LayoutSkeleton from '../../components/LayoutSkeleton.vue'
import { useFineTuneStore } from '../../stores/fine_tune'
import { copyAndShowMessage } from '../../utils'
import CreateFineTuneDialog from '../dialog/CreateFineTuneDialog.vue'
import FileAccordin from './FileAccordion.vue'

const fineTuneStore = useFineTuneStore()

const msg = useMessage()

const showAddDialog = ref(false)

onMounted(() => {
	fineTuneStore.refresh()
})
</script>

<template>
	<LayoutSkeleton title="FineTune">
		<template #titleExtra>
			<NButton
				round
				type="primary"
				class="mr-4"
				@click="showAddDialog = true"
			>
				<template #icon>
					<NIcon>
						<AddIcon></AddIcon>
					</NIcon>
				</template>
				Create
			</NButton>
		</template>

		<NGrid
			:cols="2"
			x-gap="16"
			y-gap="16"
		>
			<NGi
				v-for="item of fineTuneStore.fineTunes"
				:key="item.id"
			>
				<NCard size="small">
					<template #header>
						<span
							class="hover:underline cursor-default"
							@click="item.fine_tuned_model
								? copyAndShowMessage(item.fine_tuned_model, msg, 'Copied fine tune name to clipboard')
								: undefined"
						>
							{{ item.fine_tuned_model ?? 'New Fine Tune' }}
						</span>
					</template>
					<template #header-extra>
						<NText
							code
							class="hover:underline cursor-default mr-2"
							@click="copyAndShowMessage(item.id, msg, 'Copied id to clipboard')"
						>
							{{ item.id }}
						</NText>
						<NTag
							v-if="item.status === 'pending'"
							round
							:bordered="false"
						>
							{{ item.status }}
							<template #icon>
								<NIcon>
									<PendingIcon></PendingIcon>
								</NIcon>
							</template>
						</NTag>
						<NTag
							v-else-if="item.status === 'running'"
							type="info"
							round
							:bordered="false"
						>
							{{ item.status }}
							<template #icon>
								<NIcon>
									<RunningIcon></RunningIcon>
								</NIcon>
							</template>
						</NTag>
						<NTag
							v-else-if="item.status === 'succeeded'"
							type="success"
							round
							:bordered="false"
						>
							{{ item.status }}
							<template #icon>
								<NIcon>
									<SuccessIcon></SuccessIcon>
								</NIcon>
							</template>
						</NTag>
					</template>

					<NSpace vertical>
						<div>
							Create time: <NText code>
								<NTime
									:time="item.created_at"
									unix
								></NTime>
							</NText>
						</div>
						<div>
							Model: <NText code>
								{{ item.model }}
							</NText>
						</div>
						<FileAccordin
							class="mt-2"
							:option="[
								{ title: 'Result files', files: item.result_files },
								{ title: 'Training files', files: item.training_files },
								{ title: 'Validation files', files: item.validation_files },
							]"
						></FileAccordin>
					</NSpace>
				</NCard>
			</NGi>
		</NGrid>
	</LayoutSkeleton>
	<CreateFineTuneDialog v-model:show="showAddDialog"></CreateFineTuneDialog>
</template>
