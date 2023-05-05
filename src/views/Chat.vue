<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { NButton, NEmpty, NIcon, NInput, NInputNumber, NScrollbar, NSelect, NSlider, NSpace, useDialog, useMessage } from 'naive-ui'

import { AddCircleOutline as AddIcon } from '@vicons/ionicons5'
import ChatSession from '../components/ChatSession.vue'
import LayoutSkeleton from '../components/LayoutSkeleton.vue'
import { avaliableModels, useChatStore } from '../stores/chat'
import OptionSetting from '../components/OptionSetting.vue'
import ChatBubble from '../components/ChatBubble.vue'

const chatStore = useChatStore()
const dialog = useDialog()
const msg = useMessage()

const selectOption = avaliableModels.map(v => ({
	label: v,
	value: v,
}) as SelectOption)

const select = (id: number) => chatStore.selectedId = id

const submit = () => chatStore.submit()

const deleteSession = () => {
	const d = dialog.warning({
		title: 'Warning',
		content: 'Do you want to delete this session? It\'s UNRECOVERABLE!',
		positiveText: 'Delete',
		negativeText: 'Cancel',
		onPositiveClick: async () => {
			d.loading = true
			if (chatStore.deleteSession()) {
				msg.success('Chat session deleted successfully')
			} else {
				msg.error('Failed to delete the session')
			}
			d.loading = false
		},
	})
}
</script>

<template>
	<LayoutSkeleton
		title="Chat"
		has-sider
	>
		<template #titleExtra>
		</template>

		<div class="flex h-full justify-items-stretch">
			<!-- Session List -->
			<div class="flex flex-col flex-basis-48 min-w-48">
				<NButton
					tertiary
					type="info"
					class="my-2"
					@click="chatStore.addNewSession()"
				>
					<template #icon>
						<NIcon>
							<AddIcon></AddIcon>
						</NIcon>
					</template>
					New Chat
				</NButton>

				<ChatSession
					v-for="item of chatStore.sessions"
					:key="item.id"
					:title="item.title"
					:selected="item.id === chatStore.selectedId"
					class="mb-2"
					@click="select(item.id)"
				>
				</ChatSession>
			</div>
			<div class="divider"></div>
			<div
				v-if="!chatStore.current"
				class="flex grow"
			>
				<NEmpty class="m-auto">
					No session currently
				</NEmpty>
			</div>
			<div
				v-else
				class="flex flex-col ml-6 mb-4 grow"
			>
				<NScrollbar class="px-2">
					<div class="flex flex-col">
						<ChatBubble
							v-for="item, index of chatStore.current.history"
							:key="index"
							:from="item.role"
						>
							{{ item.content }}
						</ChatBubble>
					</div>
				</NScrollbar>

				<NInput
					v-model:value="chatStore.current.typedContent"
					type="textarea"
					:autosize="{ minRows: 1, maxRows: 5 }"
					size="small"
					placeholder="Ctrl + Enter to send the message"
					@keydown.ctrl.enter="submit"
				></NInput>

				<NSpace
					class="mt-4 flex-wrap-reverse"
					justify="end"
				>
					<NButton
						type="error"
						secondary
						@click="deleteSession"
					>
						Delete
					</NButton>
					<NButton
						type="info"
						secondary
					>
						Memory
					</NButton>
					<NButton
						type="primary"
						strong
						@click="submit"
					>
						Send
					</NButton>
				</NSpace>
			</div>
		</div>

		<template #sider>
			<div
				v-if="!chatStore.current"
				class="flex h-full"
			>
				<NEmpty class="m-auto">
					No session currently
				</NEmpty>
			</div>
			<NSpace
				v-else
				vertical
				:item-style="{ padding: '.25rem' }"
			>
				<OptionSetting title="Model">
					<NSelect
						v-model:value="chatStore.current.model"
						:options="selectOption"
					></NSelect>
				</OptionSetting>
				<OptionSetting
					title="Temperature"
					:value="chatStore.current.temperature"
				>
					<NSlider
						v-model:value="chatStore.current.temperature"
						:step="0.01"
						:tooltip="false"
						:max="1"
						:min="0"
					></NSlider>
				</OptionSetting>
				<OptionSetting
					title="Top P"
					:value="chatStore.current.top_p"
				>
					<NSlider
						v-model:value="chatStore.current.top_p"
						:step="0.01"
						:tooltip="false"
						:max="1"
						:min="0"
					></NSlider>
				</OptionSetting>
				<OptionSetting title="Attached Message">
					<NInputNumber
						v-model:value="chatStore.current.attachedMessage"
						:precision="0"
						:validator="(n:number) => n > 0"
						placeholder="Message counts"
					></NInputNumber>
				</OptionSetting>
			</NSpace>
		</template>
	</LayoutSkeleton>
</template>

<style scoped>
.divider {
	background-color: rgb(239, 239, 245);
	height: 100%;
	width: 1px;
	margin: 0 1rem;
}
</style>
