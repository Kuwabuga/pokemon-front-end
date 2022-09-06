import { resolve } from "path";
import { ServerOptions } from "https";
import vue from "@vitejs/plugin-vue";
import { AliasOptions, BuildOptions, defineConfig, ResolveOptions, UserConfigExport } from "vite";

export default defineConfig(
  <UserConfigExport>{
  	plugins: [vue()],
  	resolve: <ResolveOptions>{
  		alias: <AliasOptions>{
  			"@": resolve(__dirname, "./src")
  		}
  	},
  	server: <ServerOptions>{
  		port: 8040
  	},
  	build: <BuildOptions>{
  		chunkSizeWarningLimit: 600
  	}
  }
);
