import { Division } from "./DivisionType";
import { Official } from "./OfficialType";

export interface InvitedUser {
    id: number;
    nama_pengguna: string;
    division_id: number;
    official_id: number;
    created_at?: string;
    updated_at?: string;
    division?: Division;
    official?: Official;
}
