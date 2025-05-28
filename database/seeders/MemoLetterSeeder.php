<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\LetterType;
use App\Models\MemoLetter;
use App\Models\Official;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class MemoLetterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have the required related models
        $divisions = Division::count();
        $letterTypes = LetterType::count();
        $officials = Official::count();
        $users = User::count();

        if ($divisions === 0 || $letterTypes === 0 || $officials === 0 || $users === 0) {
            $this->command->info('Please seed the divisions, letter types, officials and users first.');
            return;
        }

        // Get IDs for relations
        $divisionIds = Division::pluck('id')->toArray();
        $letterTypeIds = LetterType::pluck('id')->toArray();
        $officialIds = Official::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();

        // Sample memo subjects and contents for variety
        $memoSubjects = [
            'Pengumuman Rapat Koordinasi Bulanan',
            'Pembaruan Kebijakan Keamanan IT',
            'Perubahan Jadwal Kerja',
            'Undangan Workshop Pengembangan Karyawan',
            'Pemberitahuan Penutupan Kantor Sementara',
            'Evaluasi Kinerja Triwulan',
            'Pengumuman Pemenang Employee of the Month',
            'Informasi Pemeliharaan Sistem',
            'Pengumuman Liburan Perusahaan',
            'Pedoman Penggunaan Fasilitas Baru'
        ];

        $memoContents = [
            'Dengan hormat, diberitahukan kepada seluruh kepala divisi untuk menghadiri rapat koordinasi bulanan yang akan dilaksanakan pada tanggal 15 pukul 10:00 WIB di Ruang Rapat Utama.',
            'Memperhatikan perkembangan ancaman keamanan siber terkini, dengan ini disampaikan pembaruan kebijakan keamanan IT yang berlaku efektif mulai tanggal 1 bulan depan.',
            'Sehubungan dengan adanya kegiatan perusahaan, jam kerja akan disesuaikan menjadi pukul 08:00 - 16:00 WIB sampai pemberitahuan lebih lanjut.',
            'Kami mengundang Anda untuk berpartisipasi dalam workshop pengembangan karyawan yang akan diadakan pada akhir bulan ini.',
            'Diberitahukan bahwa kantor akan ditutup sementara untuk renovasi pada tanggal 20-22 bulan ini. Seluruh karyawan dapat bekerja dari rumah.',
            'Diinformasikan bahwa evaluasi kinerja triwulan akan dimulai minggu depan. Harap mempersiapkan semua dokumen yang diperlukan.',
            'Selamat kepada Bapak/Ibu yang telah terpilih sebagai Employee of the Month untuk bulan ini. Penghargaan akan diberikan pada acara makan siang bersama.',
            'Sistem informasi perusahaan akan mengalami pemeliharaan pada hari Sabtu mendatang. Mohon antisipasi adanya gangguan layanan.',
            'Dengan ini diumumkan bahwa perusahaan akan libur pada tanggal 25-26 untuk merayakan hari raya. Seluruh aktivitas akan dilanjutkan pada tanggal 27.',
            'Berikut adalah pedoman penggunaan fasilitas baru yang telah diinstal di lantai 3. Harap membaca dengan seksama sebelum menggunakan.',
        ];

        $currentYear = date('Y');
        $currentMonth = date('m');

        // Create 100 memo letters
        for ($i = 0; $i < 100; $i++) {
            $monthlyCounter = $i + 1;
            $yearlyCounter = $i + 1;

            // Generate a random date within the last 30 days
            $randomDays = rand(0, 29); // 0 to 29 days ago
            $randomHours = rand(8, 17); // Business hours between 8 AM and 5 PM
            $randomMinutes = rand(0, 59);
            $randomSeconds = rand(0, 59);
            $randomDate = Carbon::now()
                ->subDays($randomDays)
                ->setHour($randomHours)
                ->setMinute($randomMinutes)
                ->setSecond($randomSeconds);

            // Pick random subject and content
            $subjectIndex = array_rand($memoSubjects);
            $contentIndex = array_rand($memoContents);

            // Add some variety to the subjects by appending the counter
            $perihal = $memoSubjects[$subjectIndex] . ' ' . ($i + 1);

            // Pick random division IDs for from and to
            $fromDivisionId = $divisionIds[array_rand($divisionIds)];
            $toDivisionId = $divisionIds[array_rand($divisionIds)];

            MemoLetter::create([
                'memo_number' => "MEMO/{$yearlyCounter}/{$currentMonth}/{$currentYear}",
                'monthly_counter' => $monthlyCounter,
                'yearly_counter' => $yearlyCounter,
                'perihal' => $perihal,
                'content' => $memoContents[$contentIndex],
                'signatory' => $userIds[array_rand($userIds)],
                'official_id' => $officialIds[array_rand($officialIds)],
                'letter_id' => $letterTypeIds[array_rand($letterTypeIds)],
                'from_division' => $fromDivisionId,
                'to_division' => $toDivisionId,
                'file_path' => null,
                'rejection_reason' => null,
                'previous_memo' => null,
                'created_at' => $randomDate,
                'updated_at' => $randomDate,
            ]);
        }

        $this->command->info('100 MemoLetters seeded successfully with randomized dates across the last 30 days!');
    }
}
