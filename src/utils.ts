import { NIcon } from 'naive-ui'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { Component } from 'vue'
import { h } from 'vue'
import copy from 'copy-to-clipboard'

export function renderIcon(icon: Component) {
	return () => h(NIcon, null, { default: () => h(icon) })
}

export function humanizeFileSize(size: number) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	let i = 0
	while (size >= 1024) {
		size /= 1024
		i++
	}
	if (i === 0) {
		return `${size} ${units[i]}`
	}
	return `${size.toFixed(2)} ${units[i]}`
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	const result = {} as Pick<T, K>
	keys.forEach((key) => {
		if (key in obj) {
			result[key] = obj[key]
		}
	})
	return result
}

export function copyAndShowMessage(textToCopy: string, api: MessageApiInjection, message: string) {
	copy(textToCopy)
	api.success(message)
}
