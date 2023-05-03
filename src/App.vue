<script setup lang="ts">
import { h } from 'vue'
import type { MenuOption } from 'naive-ui'
import { NConfigProvider, NDialogProvider, NLayout, NLayoutSider, NLoadingBarProvider, NMenu, NMessageProvider, NSpace, dateEnUS, enUS } from 'naive-ui'
import {
	ChatboxOutline as ChatIcon,
	CropOutline as EditIcon,
	FileTrayFullOutline as FileIcon,
	OptionsOutline as FineTuneIcon,
	SettingsOutline as SettingsIcon,
} from '@vicons/ionicons5'
import { RouterLink, useRoute } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { renderIcon } from './utils'

const route = useRoute()

const collapsed = useLocalStorage('collapsed', false)

const menuOptions: MenuOption[] = [
	{
		label: () => h(RouterLink, { to: { name: 'chat' } }, { default: () => 'Chat' }),
		key: 'chat',
		icon: renderIcon(ChatIcon),
	},
	{
		label: () => h(RouterLink, { to: { name: 'edit' } }, { default: () => 'Edit' }),
		key: 'edit',
		icon: renderIcon(EditIcon),
	},
	{
		label: () => h(RouterLink, { to: { name: 'file' } }, { default: () => 'File' }),
		key: 'file',
		icon: renderIcon(FileIcon),
	},
	{
		label: () => h(RouterLink, { to: { name: 'fine_tune' } }, { default: () => 'FineTune' }),
		key: 'fine_tune',
		icon: renderIcon(FineTuneIcon),
	},
	{
		label: () => h(RouterLink, { to: { name: 'settings' } }, { default: () => 'Settings' }),
		key: 'settings',
		icon: renderIcon(SettingsIcon),
	},
]
</script>

<template>
	<NConfigProvider
		:locale="enUS"
		:date-locale="dateEnUS"
	>
		<NMessageProvider>
			<NDialogProvider>
				<NLoadingBarProvider>
					<NSpace
						vertical
						class="menu"
					>
						<NLayout has-sider>
							<NLayoutSider
								bordered
								collapse-mode="width"
								:collapsed-width="64"
								:width="240"
								:collapsed="collapsed"
								show-trigger
								@collapse="collapsed = true"
								@expand="collapsed = false"
							>
								<NMenu
									:collapsed="collapsed"
									:collapsed-width="64"
									:collapsed-icon-size="22"
									:options="menuOptions"
									:value="route.name?.toString()"
								/>
							</NLayoutSider>
							<NLayout>
								<RouterView></RouterView>
							</NLayout>
						</NLayout>
					</NSpace>
				</NLoadingBarProvider>
			</NDialogProvider>
		</NMessageProvider>
	</NConfigProvider>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

.menu .n-menu {
	height: 100vh;
}

body {
	font-family: 'Noto Sans SC', sans-serif;
}
</style>
