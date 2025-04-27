<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('request_stages')->insert([
            'id' => 1,
            'stage_name' => "Pembuatan Memo Internal",
            'sequence' => 1,
            'description' => "Tahap ini merupakan awal dari pembuatan memo. Memo ini akan dikirimkan ke manajer internal untuk disetujui.",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 3,
            'status_id' => 1,
            'rejected_id' => 2,
            'is_external' => false,
        ]);
        // May use is rejectable 
        // If Rejected Didn't go anywhere change status to Rejected
        DB::table('request_stages')->insert([
            'id' => 2,
            'stage_name' => "Memo Internal Ditolak",
            'sequence' => 0,
            'description' => "Tahap ini merupakan tahap penolakan dari manajer internal. Jika memo ditolak, maka statusnya akan diubah menjadi ditolak. Pembuat Memo dapat melakukan revisi dan mengirimkan ulang memo untuk disetujui.",
            'letter_id' => 1,
            'approver_id' => 2,
            'to_stage_id' => 1,
            'status_id' => 4,
            'rejected_id' => NULL,
            'is_external' => false,
            'is_fixable' => true,
        ]);

        DB::table('request_stages')->insert([
            'id' => 3,
            'stage_name' => "Memo Internal Disetujui",
            'sequence' => 0,
            'description' => "Tahap ini merupakan tahap dimana memo telah disetujui oleh manajer internal. Setelah disetujui, memo akan dikirimkan ke manajer eksternal untuk disetujui.",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 4,
            'status_id' => 2,
            'rejected_id' => 14,
            'is_external' => true,
        ]);
        // If Rejected Go Mark as Rejected and Done
        // DB::table('request_stages')->insert([
        //     'id' => 4,
        //     'stage_name' => "Memo Internal",
        //     'sequence' => 0,
        //     'conditions' => "Approval Manajer Internal",
        //     'letter_id' => 1,
        //     'approver_id' => 1,
        //     'to_stage_id' => NULL,
        //     'status_id' => 6,
        //     'rejected_id' => NULL,
        // ]);
        DB::table('request_stages')->insert([
            'id' => 4,
            'stage_name' => "Memo Eksternal Dikerjakan",
            'sequence' => 0,
            'description' => "Tahap ini merupakan tahap dimana memo telah disetujui oleh manajer eksternal. Setelah disetujui, memo akan dikerjakan oleh divisi tersebut.",
            'letter_id' => 1,
            'approver_id' => 2,
            'to_stage_id' => 6,
            'status_id' => 3,
            'rejected_id' => 5,
            'requires_file_upload' => true,
            'is_external' => true,
        ]);
        // DB::table('request_stages')->insert([
        //     'id' => 15,
        //     'stage_name' => "Memo Eksternal Dikerjakan",
        //     'sequence' => 0,
        //     'description' => "Tahap ini merupakan tahap dimana memo telah disetujui oleh manajer eksternal. Setelah disetujui, memo akan dikerjakan oleh divisi tersebut.",
        //     'letter_id' => 1,
        //     'approver_id' => 1,
        //     'to_stage_id' => 6,
        //     'status_id' => 3,
        //     'rejected_id' => 5,
        // ]);
        DB::table('request_stages')->insert([
            'id' => 5,
            'stage_name' => "Memo Eksternal Ditolak Manajer Eksternal",
            'sequence' => 0,
            'description' => "Pada tahap ini memo ditolak oleh manajer eksternal. Jika ditolak, Memo tidak dapat direvisi dan harus dibuat ulang menggunakan nomor surat baru",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 4,
            'status_id' => 4,
            'rejected_id' => NULL,
            'is_external' => true,
        ]);
        // If rejected didn't go anywhere 
        DB::table('request_stages')->insert([
            'id' => 6,
            'stage_name' => "Memo Eksternal Selesai",
            'sequence' => 0,
            'description' => "Tahap ini merupakan tahap akhir dimana memo telah disetujui oleh manajer eksternal.",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,

        ]);
        DB::table('request_stages')->insert([
            'id' => 7,
            'stage_name' => "Pembuatan Undangan Rapat",
            'sequence' => 1,
            'description' => "Pembuatan / Edit Undangan Rapat",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => 9,
            'status_id' => 1,
            'rejected_id' => 8,
        ]);
        // If rejected mark as rejected 
        DB::table('request_stages')->insert([
            'id' => 8,
            'stage_name' => "Undangan Rapat Ditolak",
            'sequence' => 0,
            'description' => "Pembuatan / Edit Undangan Rapat",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => 7,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 9,
            'stage_name' => "Undangan Rapat Disetujui",
            'sequence' => 0,
            'description' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => 10,
            'status_id' => 3,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 10,
            'stage_name' => "Undangan Rapat Diterima",
            'sequence' => 0,
            'description' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 11,
            'stage_name' => "Delete Me",
            'sequence' => 0,
            'description' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 12,
            'stage_name' => "Delete Me",
            'sequence' => 0,
            'description' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 13,
            'stage_name' => "Delete Me",
            'sequence' => 0,
            'description' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 14,
            'stage_name' => "Memo Ditolak Manajer",
            'sequence' => 0,
            'description' => "Memo ditolak oleh Manajer Eksternal. Untuk memperbaiki buat memo baru.",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        Schema::enableForeignKeyConstraints();
    }
}
