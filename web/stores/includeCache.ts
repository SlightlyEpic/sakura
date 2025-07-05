type IncludeCacheState = Record<string, string>;

export const useIncludeCacheStore = defineStore('includeCache', {
    state: (): IncludeCacheState => ({}),
    actions: {
        set(key: string, value: string) {
            this[key] = value;
        },
        get(key: string) {
            return this[key];
        },
        delete(key: string) {
            delete this[key];
        },
    },
})
