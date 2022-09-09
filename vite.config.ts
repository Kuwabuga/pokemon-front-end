import { resolve } from "path";
import { ServerOptions } from "https";
import vue from "@vitejs/plugin-vue";
import { AliasOptions, BuildOptions, defineConfig, ResolveOptions, UserConfigExport } from "vite";
import { DevOptions, ManifestOptions, VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const vuePlugin = vue();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vitePWAPlugin = VitePWA(<Partial<VitePWAOptions>>{
	registerType: "autoUpdate",
	manifest: <Partial<ManifestOptions>>{},
	devOptions: <DevOptions>{
		enabled: false
	}
});

export default defineConfig(<UserConfigExport>{
	plugins: [vuePlugin],
	resolve: <ResolveOptions>{
		alias: <AliasOptions>{
			"@": resolve(__dirname, "./src")
		}
	},
	server: <ServerOptions>{
		port: 3000
	},
	build: <BuildOptions>{
		chunkSizeWarningLimit: 600
	}
});
