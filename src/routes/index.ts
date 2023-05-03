import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { useLocalStorage } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import Chat from '../views/Chat.vue'
import Edit from '../views/Edit.vue'
import File from '../views/File.vue'
import FineTune from '../views/FineTune.vue'
import Settings from '../views/Settings.vue'

const routes: Readonly<RouteRecordRaw[]> = [
	{ path: '/', redirect: 'chat' },
	{ path: '/chat', name: 'chat', component: Chat },
	{ path: '/edit', name: 'edit', component: Edit },
	{ path: '/file', name: 'file', component: File },
	{ path: '/fine_tune', name: 'fine_tune', component: FineTune },
	{ path: '/settings', name: 'settings', component: Settings },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, _from) => {
	const key = useLocalStorage('key', '')
	if (to.name !== 'settings') {
		// check if key exists
		if (!key.value) {
			createDiscreteApi(['message']).message.warning('Please set an OpenAI key', { keepAliveOnHover: true })
			return { name: 'settings' }
		}
	}
})

export default router
