import { Division } from "./DivisionType";
import { Invitation } from "./InvitationType";
import { Memo } from "./MemoType";
import { Stages } from "./StagesType";
import { User } from "./UserType";

export type RequestLetter = {
    id: number;
    memo?: Memo;
    invite?: Invitation;
    request_name: string;
    user_id: number;
    stages_id: number;
    letter_type_id: number;
    memo_id: number | null;
    invitation_id: number | null;
    created_at: string;
    updated_at: string;
    stages: Stages;
    // stages: {
    //     id: number;
    //     stage_name: string;
    //     requires_file_upload: number;
    // };
    request_rejected: {
        id: number;
        // other properties
    };
    to_stages: any[]; // JSON field
    rejected_stages: any[]; // JSON field
    // progress_stages: any[]; // JSON field
    progress: Array<{
        id: number;
        stage_name: string;
        description: string;
        request_rejected?: {
            id: number;
            stage_name: string;
            description: string;
        };
    }>;
};

// Relationship interfaces
export interface MemoLetterWithRelations extends Memo {
    from_division_relation?: Division;
    to_division_relation?: Division;
    letter?: Memo;
    signatory_user?: User;
}
