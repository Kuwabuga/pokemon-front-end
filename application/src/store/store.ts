import { InjectionKey } from "vue";
import { ActionContext, Store, createStore, useStore as baseUseStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { State } from "@/store/state";

const isSessionStorageSupported = () => {
  try {
    const storage = window.sessionStorage;
    storage.setItem("Kuwabuga", "isSessionStorageEnabled");
    storage.removeItem("Kuwabuga");
  } catch(error) {
    return false;
  }
}

const vuexLocal = isSessionStorageSupported() ?
  new VuexPersistence<State>({
    storage: window.sessionStorage, key: "state"
  })
  :
  undefined;

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: <State>{

  },
  mutations: {
    setState(state: State, payload: State) {
      state = payload;
    }
  },
  actions: {
    setState(context: ActionContext<State, State>, payload: State) {
      context.commit("setState", payload);
    }
  },
  plugins: vuexLocal ? [vuexLocal.plugin] : []
});

export const useStore = (): Store<State> => {
  return baseUseStore(key);
}
