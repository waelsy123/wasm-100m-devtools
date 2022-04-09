declare global {
    interface Window {
        searchEvents: {
            action: string;
            queryString?: string;
        }[];
    }
}
export {};
