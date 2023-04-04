type FlattenedItem =
    | { type: "text"; content: string }
    | { type: "variable"; content: string, description: string; }
    | { type: "paragraph" };

export type Prompts = Record<
    string,
    {
        id: string;
        branchId: string
        versions: Record<number, {
            text: string;
            parts: FlattenedItem[];
        }>
    }
>;