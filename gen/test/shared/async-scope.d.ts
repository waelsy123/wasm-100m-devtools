export declare class AsyncScope {
    static scopes: Set<AsyncScope>;
    private asyncStack;
    private canceled;
    setCanceled(): void;
    isCanceled(): boolean;
    get stack(): string[] | null;
    push(): void;
    pop(): void;
    exec<T>(callable: () => Promise<T>): Promise<T>;
    execSync<T>(callable: () => T): T;
}
