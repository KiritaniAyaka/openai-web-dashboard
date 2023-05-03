import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { h } from 'vue'

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
