import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { useLocalStorage } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import Chat from '../views/ChatPage.vue'
import Edit from '../views/EditPage.vue'
import File from '../views/FilePage.vue'
import FineTune from '../views/FineTunePage/FineTunePage.vue'
import Settings from '../views/SettingsPage.vue'

const msg = createDiscreteApi(['message']).message

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
			msg.warning('Please set an OpenAI key', { keepAliveOnHover: true })
			return { name: 'settings' }
		}
	}
})

export default router
