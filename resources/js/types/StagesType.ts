import { Status } from "./StatusType";

export type Stages = {
    id: number;
    stage_name: string;
    description: string;
    created_at: string;
    updated_at: string;
    sequence: number;
    to_stage_id: number | null;
    rejected_id: number | null;
    // conditions: string | null;
    letter_id: number;
    approver_id: number;
    status_id: number;
    deleted_at?: string | null;
    status: Status;
    request_approved: Stages | null;
    request_rejected: Stages | null;
    requires_file_upload: number;
    is_external: number;
};
