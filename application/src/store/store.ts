import { InjectionKey } from "vue";
import { ActionContext, Store, createStore, useStore as baseUseStore, StoreOptions, MutationTree, ActionTree } from "vuex";
import VuexPersistence, { PersistOptions } from "vuex-persist";
import { State } from "@/store/state";

const isSessionStorageSupported = () => {
	try {
		const storage = window.sessionStorage;
		storage.setItem("isSessionStorageEnabled", "true");
		storage.removeItem("isSessionStorageEnabled");
	} catch(error) {
		return false;
	}
};

const vuexLocal = isSessionStorageSupported() ?
	new VuexPersistence<State>(
    <PersistOptions<State>>{
    	storage: window.sessionStorage, key: "state"
    })
	: undefined;

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>(
  <StoreOptions<State>>{
  	state: <State>{
  		example: "dummy"
  	},
  	actions: <ActionTree<State, State>>{
  		setState(context: ActionContext<State, State>, payload: State): void {
  			context.commit("setState", payload);
  		}
  	},
  	mutations: <MutationTree<State>>{
  		setState(state: State, payload: State): void {
  			state = payload;
  		}
  	},
  	plugins: vuexLocal ? [vuexLocal.plugin] : []
  }
);

export const useStore = (): Store<State> => {
	return baseUseStore(key);
};
