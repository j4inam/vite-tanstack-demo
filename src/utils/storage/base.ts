export interface BaseStorageOptions {
    keySuffix?: string
}

export abstract class BaseStorage {
    constructor(protected options: BaseStorageOptions = {}) {
        if (typeof this.options.keySuffix !== 'string') this.options.keySuffix = ''
    }
    protected getSuffixedKey(key: string): string {
        return this.options.keySuffix ? `${key}_${this.options.keySuffix}` : key
    }
    abstract set(key: string, value: string, options?: unknown): void
    abstract get(key: string): string
    abstract delete(key: string): void
}