<script setup lang="ts">
import type { OpenAIFile } from 'openai'
import { computed } from 'vue'
import { NCollapse, NCollapseItem, NList, NListItem, NTag, NText, NThing, NTime, useMessage } from 'naive-ui'
import { copyAndShowMessage, humanizeFileSize } from '../../utils'

export interface FileList {
	files: OpenAIFile[]
	title: string
}

const props = defineProps<{
	option: FileList[]
}>()

const msg = useMessage()

const name = computed(() => props.option.map(item => item.title.replace(' ', '_')))
</script>

<template>
	<NCollapse accordion>
		<NCollapseItem
			v-for="item, index of props.option"
			:key="name[index]"
			:title="item.title"
			:name="name[index]"
		>
			<NList>
				<NListItem
					v-for="file of item.files"
					:key="file.id"
				>
					<NThing>
						<template #header>
							{{ file.filename }}
						</template>
						<template #header-extra>
							<NText
								code
								class="cursor-default hover:underline"
								@click="copyAndShowMessage(file.id, msg, 'Copied id to clipboard')"
							>
								{{ file.id }}
							</NText>
							<NTag
								round
								:bordered="false"
								type="info"
								class="ml-2"
							>
								{{ file.purpose }}
							</NTag>
						</template>

						<div class="flex">
							<div class="grow">
								Create time: <NText code>
									<NTime
										:time="file.created_at"
										unix
									></NTime>
								</NText>
							</div>
							<div class="grow">
								Size: <NText code>
									{{ humanizeFileSize(file.bytes) }}
								</NText>
							</div>
						</div>
					</NThing>
				</NListItem>
			</NList>
		</NCollapseItem>
	</NCollapse>
</template>
