/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknow>, Record<string, unknown>, unknown>;
  export default component;
}
