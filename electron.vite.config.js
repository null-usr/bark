import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { resolve } from 'path'

export default defineConfig({
	main: {
		build: {
			rollupOptions: {
				input: {
					main: resolve(__dirname, 'electron', 'main', 'main.ts'),
				},
			},
		},
	},
	preload: {
		build: {
			rollupOptions: {
				input: {
					preload: resolve(
						__dirname,
						'electron',
						'preload',
						'preload.ts'
					),
				},
			},
		},
	},
	renderer: {
		root: '.',
		plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'index.html'),
					about: resolve(__dirname, 'about.html'),
				},
			},
		},
	},
})
