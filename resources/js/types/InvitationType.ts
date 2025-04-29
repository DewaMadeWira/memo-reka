import { Division } from "./DivisionType";

export type Invitation = {
    id: number;
    invitation_number: string;
    perihal: string;
    content: string;
    signatory: number;
    letter_id: number;
    from_division: Division;
    to_division: Division;
    created_at?: string;
    updated_at?: string;
    rejection_reason?: string;
};
