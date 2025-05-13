import { Invitation } from "./InvitationType";

export type Summary = {
    id: number;
    invitation_id: number;
    file_path: string;
    invitation: Invitation;
    created_at: Date;
    updated_at: Date;
};
