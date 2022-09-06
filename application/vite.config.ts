import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { defineConfig, UserConfigExport } from "vite";

// https://vitejs.dev/config/
export default defineConfig(<UserConfigExport>{
	plugins: [vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		}
	},
	server: {
		port: 8040
	},
	build: {
		chunkSizeWarningLimit: 600
	}
});
