import { Division } from "./DivisionType";

export type Memo = {
    id: number;
    memo_number: string;
    perihal: string;
    content: string;
    signatory: number;
    letter_id: number;
    from_division: Division;
    to_division: Division;
    created_at?: string;
    updated_at?: string;
    file_path?: string;
    rejection_reason?: string;
};
