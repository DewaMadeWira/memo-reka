import { Division } from "./DivisionType";
import { Memo } from "./MemoType";
import { User } from "./UserType";

export type RequestLetter = {
    id: number;
    request_name: string;
    user_id: number;
    stages_id: number;
    letter_type_id: number;
    memo_id: number | null;
    invitation_id: number | null;
    created_at: string;
    updated_at: string;
    to_stages: any[]; // JSON field
    rejected_stages: any[]; // JSON field
    progress_stages: any[]; // JSON field
};

// Relationship interfaces
export interface MemoLetterWithRelations extends Memo {
    from_division_relation?: Division;
    to_division_relation?: Division;
    letter?: Memo;
    signatory_user?: User;
}
