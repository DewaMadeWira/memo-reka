<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('memo_letters')->insert([
            [
                'memo_number' => "171.21/REKA/GEN/QMSHE-TI/X/2024",
                'perihal' => 'Permintaan Alat',
                'content' => "Berdasarkan kegiatan Preventive Maintenance fasilitas TI maka Teknologi Informasi membutuhkan kebutuhan sebagai berikut:\n\nLorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis totam ducimus quasi tenetur\nexcepturi harum minus, sapiente doloremque fugiat itaque rem impedit saepe omnis ipsam odit\nhic mollitia porro quis vel obcaecati quos assumenda facilis officia! Ducimus modi amet odio\naccusamus unde deserunt, aspernatur quas id sequi, fugiat natus cumque.\n\nMaka bersama memo ini kami memohon agar dapat dilakukan pengadaan kebutuhan fasilitas\nTI tersebut.",
                'signatory' => 2,
                'letter_id' => 1,
                'from_division' => 1,
                'to_division' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
