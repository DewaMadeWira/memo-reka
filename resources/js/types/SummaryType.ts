import { Invitation } from "./InvitationType";

export type Summary = {
    id: number;
    invitation_id: number;
    file_path: string;
    invitation: Invitation;
    judul_rapat:string;
    rangkuman_rapat:string;
    rejection_reason?: string;
    created_at: Date;
    updated_at: Date;
    invite?: Invitation;
};
