export type Pilihan = {
  nilai: number;
  teks: string;
};

export type Pertanyaan = {
  id: number;
  teks: string;
  pilihan: Pilihan[];
};

export type Domain = {
  nama: string;
  warna: string;
  pertanyaan: Pertanyaan[];
};

export const DOMAINS: Domain[] = [
  {
    nama: "Budaya",
    warna: "blue",
    pertanyaan: [
      {
        id: 1,
        teks: "Bagaimana pandangan organisasi terhadap penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Penggunaan teknologi informasi hanya untuk “paperless” saja" },
          { nilai: 1, teks: "Penggunaan teknologi informasi hanya di bagian rekam medis dengan aplikasi" },
          { nilai: 2, teks: "Sebagai teknologi klinik untuk efesiensi alur kerja" },
          { nilai: 3, teks: "Data dapat diakses cepat dan dimana saja" },
          { nilai: 4, teks: "Kemajuan teknologi untuk tujuan meningkatkan pelayanan kesehatan yang berkualitas" },
          { nilai: 5, teks: "Mengintegrasikan data dari berbagai sumber, pendukung pelayanan kesehatan yang berkualitas dan keputusan klinis" },
        ],
      },
      {
        id: 2,
        teks: "Siapa saja yang terlibat dalam proses perencanaan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Manajemen puncak (Top Manajemen) saja" },
          { nilai: 1, teks: "Manajemen puncak (Top Manajemen) dan atau tim yang terpilih" },
          { nilai: 2, teks: "Kepala Bagian Perencanaan atau kepala unit/instalasi" },
          { nilai: 3, teks: "Kepala unit/instalasi dan koordinator yang ikut serta saja" },
          { nilai: 4, teks: "Manajemen puncak, Kepala Bagian Perencanaan dan Tim yang terpilih" },
          { nilai: 5, teks: "Semua unit/instalasi dan semua tim saling bekerja sama" },
        ],
      },
      {
        id: 3,
        teks: "Bagaimana tingkat keterlibatan staf medis dalam proses penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Tidak melibatkan staf medis dalam proses penerapan Rekam Medis Elektronik" },
          { nilai: 1, teks: "Terbatas pada staf medis dan staf dengan kewenangan klinis untuk mewakili kepentingan klinis" },
          { nilai: 2, teks: "Melibatkan staf medis tetapi hanya pada keputusan klinis saja" },
          { nilai: 3, teks: "Melibatkan staf medis untuk keputusan kunci dan keputusan klinis" },
          { nilai: 4, teks: "Hanya aktif dalam perencanaan dan pengambilan keputusan saja" },
          { nilai: 5, teks: "Aktif dalam perencanaan dan pengambilan keputusan; selaras dengan kepentingan klinis dan manajerial" },
        ],
      },
      {
        id: 4,
        teks: "Bagaimana pembahasan dan dokumentasi kerangka kerja yang digunakan untuk menguraikan prioritas penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dibahas" },
          { nilai: 1, teks: "Telah dibahas namun belum menyeluruh" },
          { nilai: 2, teks: "Telah dibahas secara menyeluruh" },
          { nilai: 3, teks: "Telah dibahas tetapi tidak didokumentasikan sebelum memulai evaluasi vendor (pihak penyedia sistem)" },
          { nilai: 4, teks: "Telah didokumentasikan sebelum memulai evaluasi vendor (pihak penyedia sistem), namun belum digunakan untuk memfasilitasi proses pengambilan Keputusan" },
          { nilai: 5, teks: "Telah didokumentasikan sebelum memulai evaluasi vendor (pihak penyedia sistem) dan digunakan untuk memfasilitasi proses pengambilan Keputusan." },
        ],
      },
    ],
  },
  {
    nama: "Kepemimpinan",
    warna: "purple",
    pertanyaan: [
      {
        id: 5,
        teks: "Bagaimana tingkat kepemimpinan organisasi dalam mendukung penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Percaya Rekam Medis Elektronik diperlukan, tetapi belum dibagi mengenai bagaimana pelaksaaan, tujuan dan kapan harus tercapai tujuan utama" },
          { nilai: 1, teks: "Percaya Rekam Medis Elektronik diperlukan dan dibagi mengenai bagaimana pelaksaaan tujuan dan kapan harus tercapai tujuan utama" },
          { nilai: 2, teks: "Telah mempelajari pro dan kontra penerapan Rekam Medis Elektronik" },
          { nilai: 3, teks: "Telah mempelajari pro dan kontra penerapan Rekam Medis Elektronik dan dapat membuat argumen bahwa manfaat yang ditimbulkan akan lebih besar daripada biaya yang akan dikeluarkan" },
          { nilai: 4, teks: "Memahami manfaat Rekam Medis Elektronik, namun belum menetapkan visi yang jelas" },
          { nilai: 5, teks: "Memahami manfaat Rekam Medis Elektronik dan menetapkan visi yang jelas dan konsisten bagaimana Rekam Medis Elektronik mendukung efisiensi dan sasaran peningkatan kualitas" },
        ],
      },
      {
        id: 6,
        teks: "Bagaimana peran tim pengambil keputusan dalam proses perencanaan penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Bergantung pada vendor untuk memberikan panduan perencanaan Rekam Medis Elektronik" },
          { nilai: 1, teks: "Bergantung pada vendor untuk memberikan panduan perencanaan Rekam Medis Elektronik, tetapi tim terpilih mulai ikut berpartisipasi" },
          { nilai: 2, teks: "Perencanaan pendelegasian rencana Rekam Medis Elektronik kepada manajer atau tim terpilih" },
          { nilai: 3, teks: "Mendelegasikan perencanaan Rekam Medis Elektronik kepada manajer atau tim terpilih" },
          { nilai: 4, teks: "Merencanakan waktu yang substansial untuk perencanaan peningkatan kualitas dengan teknologi Rekam Medis Elektronik" },
          { nilai: 5, teks: "Mencurahkan waktu yang substansial untuk perencanaan peningkatan kualitas dengan teknologi Rekam Medis Elektronik" },
        ],
      },
    ],
  },
  {
    nama: "Strategi",
    warna: "green",
    pertanyaan: [
      {
        id: 7,
        teks: "Bagaimana peran teknologi informasi dalam proses perencanaan strategis organisasi terkait penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Tidak dianggap sebagai bagian dari proses perencanaan strategi" },
          { nilai: 1, teks: "Dianggap sebagai perencanaan strategis dan operasional yang ditangani melalui proyek khusus" },
          { nilai: 2, teks: "Telah dianggap sebagai bagian terpisah dari proses perencanaan strategis organisasi" },
          { nilai: 3, teks: "Telah dianggap sebagai bagian terpisah dari proses perencanaan strategis organisasi dan menghasilkan Rencana Strategis dalam teknologi informasi" },
          { nilai: 4, teks: "Menjadi bagian integral dari proses perencanaan strategis organisasi" },
          { nilai: 5, teks: "Menjadi bagian integral dari proses perencanaan strategis organisasi dan menghasilkan rencana strategis 3 tahun yang memandu pengadaan Rekam Medis Elektronik" },
        ],
      },
      {
        id: 8,
        teks: "Bagaimana organisasi mendefinisikan dan mendokumentasikan tujuan kualitas dan efisiensi dalam kaitannya dengan penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dibahas" },
          { nilai: 1, teks: "Sudah dibahas, tetapi tidak jelas tujuan organisasinya dan tidak terhubung dengan teknologi Rekam Medis Elektronik" },
          { nilai: 2, teks: "Sudah dibahas, tetapi tidak didefinisikan secara jelas dengan cara yang terukur dan tidak terhubung dengan teknologi Rekam Medis Elektronik" },
          { nilai: 3, teks: "Sudah dibahas dan didefinisikan secara jelas dengan cara yang terukur, namun tidak terhubung dengan teknologi Rekam Medis Elektronik" },
          { nilai: 4, teks: "Sudah didefinisikan sebagai tujuan utama dalam rencana strategis dengan tujuan yang jelas, namun belum sesuai dan tidak terhubung dengan teknologi Rekam Medis Elektronik" },
          { nilai: 5, teks: "Sudah didefinisikan dan didokumentasikan sebagai tujuan utama dalam Rencana Strategis dengan tujuan terukur dan horizon waktu yang sesuai serta jelas terhubung dengan teknologi Rekam Medis Elektronik" },
        ],
      },
    ],
  },
  {
    nama: "Manajemen Informasi",
    warna: "yellow",
    pertanyaan: [
      {
        id: 9,
        teks: "Bagaimana tingkat optimalisasi penggunaan sistem Rekam Medis Elektronik (RME) dalam mendukung manajemen pelayanan pasien?",
        pilihan: [
          { nilai: 0, teks: "Belum dioptimalkan atau digunakan untuk manajemen pelayanan pasien" },
          { nilai: 1, teks: "Sudah mulai dioptimalkan atau digunakan untuk manajemen pelayanan pasien" },
          { nilai: 2, teks: "Telah banyak digunakan, namun hanya sebagian fitur yang memfasilitasi manajemen pelayanan pasien" },
          { nilai: 3, teks: "Telah banyak digunakan, termasuk sejumlah fitur yang memfasilitasi manajemen pelayanan pasien" },
          { nilai: 4, teks: "Telah dioptimalkan, namun modul yang mendukung manajemen pelayanan pasien belum dimanfaatkan sepenuhnya" },
          { nilai: 5, teks: "Telah dioptimalkan dan modul yang mendukung manajemen pelayanan pasien dimanfaatkan sepenuhnya" },
        ],
      },
      {
        id: 10,
        teks: "Bagaimana tingkat pendefinisian dan dokumentasi laporan yang dihasilkan oleh Rekam Medis Elektronik (RME) untuk mendukung manajemen, pelaporan data, dan peningkatan mutu pelayanan?",
        pilihan: [
          { nilai: 0, teks: "Belum didefinisikan atau didokumentasikan" },
          { nilai: 1, teks: "Sudah direncanakan untuk didefinisikan atau didokumentasikan" },
          { nilai: 2, teks: "Telah didefinisikan sebagian tetapi belum didokumentasikan" },
          { nilai: 3, teks: "Telah didefinisikan secara keseluruhan tetapi belum didokumentasikan" },
          { nilai: 4, teks: "Telah didefinisikan, didokumentasikan dan memiliki persyaratan tertentu, tetapi belum termasuk dalam proses evaluasi produk pelayanan" },
          { nilai: 5, teks: "Telah didefinisikan, didokumentasikan dan persyaratan tertentu termasuk dalam proses evaluasi produk pelayanan" },
        ],
      },
    ],
  },
  {
    nama: "Staf Klinis dan Administrasi",
    warna: "red",
    pertanyaan: [
      {
        id: 11,
        teks: "Bagaimana tingkat kompetensi dan keterlibatan staf atau sumber daya manusia yang didedikasikan untuk pengelolaan kontrak dengan pihak ketiga (vendor) dalam penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Terlibat dalam aspek-aspek spesifik dalam proses pengambilan keputusan Rekam Medis Elektronik tetapi tidak memiliki pengalaman dalam pemilihan vendor atau negosiasi" },
          { nilai: 1, teks: "Terlibat dalam aspek-aspek spesifik dalam proses pengambilan keputusan Rekam Medis Elektronik tetapi tidak memiliki pengalaman dalam pemilihan vendor atau negosiasi terkait produk" },
          { nilai: 2, teks: "Memiliki pemahaman umum tentang produk yang disediakan oleh penyedia layanan tetapi tidak memiliki pengalaman pemilihan vendor atau negosiasi" },
          { nilai: 3, teks: "Memiliki pemahaman umum tentang produk tetapi mungkin tidak memiliki pengalaman pemilihan vendor atau negosiasi; produk yang tersedia telah digunakan sebagai pedoman untuk menentukan persyaratan prioritas tinggi" },
          { nilai: 4, teks: "Berpengalaman dalam kontrak vendor, menggerakkan analisis kemampuan produk untuk memenuhi kebutuhan dan kemampuan klinik serta menentukan pendekatan dan ketentuan kontrak yang optimal" },
          { nilai: 5, teks: "Berpengalaman dalam kontrak vendor, menggerakkan analisis kemampuan produk untuk memenuhi kebutuhan dan kemampuan klinik serta menentukan pendekatan dan ketentuan kontrak yang optimal; persyaratan klinik telah didokumentasikan dalam perjanjian kerjasama secara terperinci sebagai tambahan kontrak" },
        ],
      },
      {
        id: 12,
        teks: "Bagaimana tingkat analisis dan perencanaan kebutuhan staf untuk implementasi dan penggunaan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dianalisis" },
          { nilai: 1, teks: "Telah dianalisis" },
          { nilai: 2, teks: "Secara umum dipahami, tetapi rencana kepegawaian belum dikembangkan" },
          { nilai: 3, teks: "Telah dikembangkan, namun belum didokumentasikan" },
          { nilai: 4, teks: "Telah didokumentasikan dalam susunan kepegawaian, merinci susunan kepegawaian saat ini dan kebutuhan yang diusulkan dalam masa yang akan datang" },
          { nilai: 5, teks: "Telah didokumentasikan dalam susunan kepegawaian, merinci susunan kepegawaian saat ini dan kebutuhan yang diusulkan; persyaratan telah dimasukkan dalam proses perencanaan kepegawaian" },
        ],
      },
      {
        id: 13,
        teks: "Bagaimana tingkat kesiapan dan kompetensi staf yang didedikasikan untuk manajemen proyek, manajemen perubahan, dan peningkatan kualitas dalam penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum diidentifikasi secara spesifik" },
          { nilai: 1, teks: "Telah dilakukan identifikasi" },
          { nilai: 2, teks: "Hanya memiliki pemahaman dasar tentang fungsi Rekam Medis Elektronik" },
          { nilai: 3, teks: "Memiliki pemahaman dasar tentang fungsi Rekam Medis Elektronik dan menunjang dalam proses pengambilan keputusan" },
          { nilai: 4, teks: "Berpengalaman, telah dididik tentang fungsi Rekam Medis Elektronik dan dampak alur kerja, namun belum diberi kewenangan untuk memimpin proses pengambilan Keputusan" },
          { nilai: 5, teks: "Berpengalaman, telah dididik tentang fungsi Rekam Medis Elektronik dan dampak alur kerja serta diberi kewenangan untuk memimpin proses pengambilan Keputusan" },
        ],
      },
    ],
  },
  {
    nama: "Training",
    warna: "orange",
    pertanyaan: [
      {
        id: 14,
        teks: "Bagaimana perencanaan pelatihan formal dalam mendukung implementasi Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Bukan bagian dari proses perencanaan" },
          { nilai: 1, teks: "Staf klinis dan administrasi akan menerima pelatihan dari vendor dan di tempat kerja" },
          { nilai: 2, teks: "Termasuk implementasi Rekam Medis Elektronik dan kesenjangan keterampilan untuk dokter dan tenaga medis yang diperlukan saja" },
          { nilai: 3, teks: "Termasuk implementasi Rekam Medis Elektronik dan kesenjangan keterampilan untuk dokter, tenaga medis, dan staf adalah bagian dari proses perencanaan" },
          { nilai: 4, teks: "Termasuk implementasi Rekam Medis Elektronik, pelatihan keterampilan untuk manajemen, dokter, dan staf adalah bagian dari proses perencanaan" },
          { nilai: 5, teks: "Termasuk implementasi Rekam Medis Elektronik, desain ulang alur kerja, dan kesenjangan keterampilan untuk manajemen, dokter, dan staf adalah bagian dari proses perencanaan" },
        ],
      },
      {
        id: 15,
        teks: "Bagaimana perencanaan dan pelaksanaan program pelatihan bagi manajer proyek dan staf teknologi informasi yang terlibat dalam adopsi Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dimasukkan sebagai bagian dari inisiatif Rekam Medis Elektronik" },
          { nilai: 1, teks: "Akan dimasukkan sebagai bagian dari inisiatif Rekam Medis Elektronik" },
          { nilai: 2, teks: "Akan diidentifikasi sesuai kebutuhan manajemen" },
          { nilai: 3, teks: "Telah diidentifikasi sesuai kebutuhan manajemen" },
          { nilai: 4, teks: "Telah diidentifikasi untuk memastikan staf ini memiliki keahlian yang sesuai" },
          { nilai: 5, teks: "Telah diidentifikasi dan dilaksanakan untuk memastikan staf ini memiliki keahlian yang sesuai" },
        ],
      },
    ],
  },
  {
    nama: "Proses Alur Kerja",
    warna: "teal",
    pertanyaan: [
      {
        id: 16,
        teks: "Bagaimana tingkat perencanaan dan dokumentasi proses administrasi serta proses klinis yang akan diintegrasikan ke dalam Rekam Medis Elektronik (RME), termasuk proyeksi peningkatan jumlah pasien dan kebutuhan sumber daya manusia?",
        pilihan: [
          { nilai: 0, teks: "Tidak dikembangkan" },
          { nilai: 1, teks: "Telah dipertimbangkan tetapi belum dianalisis" },
          { nilai: 2, teks: "Umumnya dipahami dan dimasukkan ke dalam evaluasi produk, tetapi desain ulang alur kerja dan pendekatan manajemen perubahan belum dipertimbangkan" },
          { nilai: 3, teks: "Umumnya dipahami dan dimasukkan ke dalam evaluasi produk, tetapi desain ulang alur kerja dan pendekatan manajemen perubahan tidak didokumentasikan" },
          { nilai: 4, teks: "Didokumentasikan dalam peta proses dan persyaratan dimasukkan dalam proses evaluasi produk saja" },
          { nilai: 5, teks: "Didokumentasikan dalam peta proses dan persyaratan dimasukkan dalam proses evaluasi produk; proses perencanaan telah dilakukan untuk mendesain ulang alur kerja dan mengubah pendekatan manajemen" },
        ],
      },
      {
        id: 17,
        teks: "Bagaimana tingkat pengembangan kebijakan, prosedur, dan protokol yang diperlukan dalam pengelolaan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dipertimbangkan" },
          { nilai: 1, teks: "Telah dipertimbangkan tetapi belum dianalisis" },
          { nilai: 2, teks: "Telah dianalisis, tetapi rencana pengembangan belum disiapkan" },
          { nilai: 3, teks: "Telah dianalisis dan rencana pengembangan telah disiapkan" },
          { nilai: 4, teks: "Telah dianalisis dan dikembangkan termasuk hak akses informasi, koreksi rekam medis, waktu henti sistem, namun belum mencakup persyaratan penyimpanan data dan pencetakan catatan" },
          { nilai: 5, teks: "Telah dianalisis dan dikembangkan termasuk hak akses informasi, koreksi rekam medis, waktu henti sistem, persyaratan penyimpanan data, dan pencetakan catatan" },
        ],
      },
    ],
  },
  {
    nama: "Akuntabilitas",
    warna: "indigo",
    pertanyaan: [
      {
        id: 18,
        teks: "Bagaimana kejelasan penetapan peran dan tanggung jawab dalam menganalisis produk, menyusun ketentuan kontrak, dan melakukan negosiasi dengan vendor pada penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dianalisis" },
          { nilai: 1, teks: "Akan dibentuk dan ditugaskan; kemungkinan akan ada dalam kelompok tim manajemen" },
          { nilai: 2, teks: "Telah dikembangkan, namun persyaratan umumnya belum dipahami dan diprioritaskan" },
          { nilai: 3, teks: "Telah dikembangkan dan persyaratan umumnya dipahami dan sesuai dengan prioritas" },
          { nilai: 4, teks: "Telah ditugaskan dengan jelas, namun persyaratan dan harapan belum ditangkap dan direspons vendor" },
          { nilai: 5, teks: "Telah ditugaskan dan jelas; persyaratan dan harapan telah ditangkap dan respons vendor didokumentasikan" },
        ],
      },
    ],
  },
  {
    nama: "Keuangan dan Anggaran",
    warna: "emerald",
    pertanyaan: [
      {
        id: 19,
        teks: "Bagaimana pandangan organisasi terhadap investasi teknologi dalam penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Pengeluaran lebih besar daripada investasinya" },
          { nilai: 1, teks: "Lebih banyak pengeluaran daripada investasi yang membutuhkan pengembalian investasi berdasarkan TI tradisional atau model otomatisasi kantor" },
          { nilai: 2, teks: "Investasi yang membutuhkan jangka waktu kurang dari 1 tahun untuk pengembalian atas investasi" },
          { nilai: 3, teks: "Investasi yang membutuhkan jangka waktu kurang dari 2 tahun untuk pengembalian atas investasi" },
          { nilai: 4, teks: "Investasi daripada biaya; kasus bisnis dianalisis dalam jangka waktu yang lebih lama" },
          { nilai: 5, teks: "Investasi daripada biaya; kasus bisnis dianalisis dalam jangka waktu yang lebih lama dan menggabungkan pengembalian yang tidak dapat dihitung" },
        ],
      },
      {
        id: 20,
        teks: "Bagaimana kesiapan pendanaan untuk akuisisi dan pemeliharaan berkelanjutan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Dana belum diidentifikasi" },
          { nilai: 1, teks: "Dana mulai direncanakan" },
          { nilai: 2, teks: "Direncanakan akan didanai dengan dana diskresioner satu kali" },
          { nilai: 3, teks: "Akan didanai dengan dana diskresioner satu kali" },
          { nilai: 4, teks: "Akan didanai dengan modal yang mulai direncanakan untuk itu" },
          { nilai: 5, teks: "Akan didanai dengan modal yang telah disepakati untuk disisihkan" },
        ],
      },
    ],
  },
  {
    nama: "Keterlibatan Pasien",
    warna: "pink",
    pertanyaan: [
      {
        id: 21,
        teks: "Bagaimana tingkat perencanaan interaksi pasien dalam penggunaan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dievaluasi" },
          { nilai: 1, teks: "Telah dipertimbangkan tetapi belum dianalisis" },
          { nilai: 2, teks: "Dipertimbangkan, tetapi tidak ada persyaratan yang telah didokumentasikan" },
          { nilai: 3, teks: "Dipertimbangkan, dan persyaratan telah mulai didokumentasikan" },
          { nilai: 4, teks: "Ditentukan dengan masukan pasien dan sebagian persyaratan telah dimasukkan dalam proses perencanaan" },
          { nilai: 5, teks: "Ditentukan dengan masukan pasien dan seluruh persyaratan telah dimasukkan dalam proses perencanaan" },
        ],
      },
      {
        id: 22,
        teks: "Bagaimana tingkat pengembangan kebijakan dan prosedur terkait akses, koreksi Rekam Medis Elektronik (RME), serta pelepasan informasi pasien?",
        pilihan: [
          { nilai: 0, teks: "Belum dievaluasi" },
          { nilai: 1, teks: "Telah dipertimbangkan tetapi belum dianalisis" },
          { nilai: 2, teks: "Telah dibahas tetapi tidak didokumentasikan" },
          { nilai: 3, teks: "Telah dibahas tetapi tidak didokumentasikan; ada rencana untuk mengembangkan kebijakan dan prosedur" },
          { nilai: 4, teks: "Telah dianalisis dan persyaratan dimasukkan dalam proses perencanaan" },
          { nilai: 5, teks: "Telah dianalisis dan persyaratan dimasukkan dalam proses perencanaan; ada rencana untuk mengembangkan komunikasi untuk pasien dan organisasi eksternal" },
        ],
      },
      {
        id: 23,
        teks: "Bagaimana tingkat perencanaan proses rujukan resep elektronik dalam penerapan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dievaluasi" },
          { nilai: 1, teks: "Telah dipertimbangkan tetapi belum dianalisis" },
          { nilai: 2, teks: "Telah dibahas tetapi tidak ada rencana khusus" },
          { nilai: 3, teks: "Telah dibahas dan dibuat rencana khusus" },
          { nilai: 4, teks: "Telah dirancang, tetapi persyaratan belum dimasukkan ke dalam proses perencanaan" },
          { nilai: 5, teks: "Telah dirancang dan persyaratan termasuk dalam proses perencanaan" },
        ],
      },
    ],
  },
  {
    nama: "Dukungan Manajemen TI",
    warna: "cyan",
    pertanyaan: [
      {
        id: 24,
        teks: "Bagaimana tingkat kesiapan manajemen teknologi informasi dalam mendukung implementasi Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Pengalaman terbatas dengan integrasi sistem saja" },
          { nilai: 1, teks: "Pengalaman terbatas dengan integrasi sistem atau konversi data, dan sangat bergantung pada sumber daya eksternal untuk perencanaan dan pengambilan keputusan tim IT" },
          { nilai: 2, teks: "Pengalaman dengan integrasi sistem atau konversi data tetapi menyerahkan sepenuhnya perincian tugas dan kegiatan pada vendor" },
          { nilai: 3, teks: "Pengalaman dengan integrasi sistem atau konversi data tetapi cenderung bergantung pada vendor untuk merinci tugas dan kegiatan" },
          { nilai: 4, teks: "Berpengalaman dengan integrasi sistem, konversi data, dan mengelola sumber daya ahli untuk mengisi keterampilan internal atau kesenjangan pengetahuan" },
          { nilai: 5, teks: "Pengalaman yang sangat kuat dengan integrasi sistem, konversi data, dan mengelola sumber daya ahli untuk mengisi keterampilan internal atau kesenjangan pengetahuan" },
        ],
      },
      {
        id: 25,
        teks: "Bagaimana tingkat perencanaan dan penetapan staf teknologi informasi untuk mendukung implementasi, pemeliharaan, infrastruktur, dan penggunaan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Belum dianalisis" },
          { nilai: 1, teks: "Sudah dianalisis namun secara umum belum dipahami" },
          { nilai: 2, teks: "Secara umum dipahami tetapi tidak didokumentasikan dalam proses perencanaan" },
          { nilai: 3, teks: "Secara umum dipahami dan telah didokumentasikan dalam proses perencanaan" },
          { nilai: 4, teks: "Telah didokumentasikan dalam Rencana Kepegawaian, namun persyaratan belum dimasukkan dalam proses perencanaan" },
          { nilai: 5, teks: "Telah didokumentasikan dalam Rencana Kepegawaian dan persyaratan telah dimasukkan dalam proses perencanaan" },
        ],
      },
      {
        id: 26,
        teks: "Bagaimana tingkat keterlibatan dan kesiapan staf IT dalam proses perencanaan dan implementasi Rekam Medis Elektronik (RME) di fasilitas pelayanan kesehatan?",
        pilihan: [
          { nilai: 0, teks: "Tidak dilibatkan dalam proses perencanaan" },
          { nilai: 1, teks: "Menentukan persyaratan infrastruktur TI tanpa keterlibatan dalam proses" },
          { nilai: 2, teks: "Terlibat dalam proses pengambilan keputusan saja" },
          { nilai: 3, teks: "Terlibat dalam proses pengambilan keputusan untuk menentukan persyaratan infrastruktur TI" },
          { nilai: 4, teks: "Akan mengikuti pendidikan tentang tujuan Rekam Medis Elektronik untuk secara aktif terlibat dalam proses pengambilan keputusan Rekam Medis Elektronik dan menentukan persyaratan infrastruktur TI yang diperlukan" },
          { nilai: 5, teks: "Telah dididik secara khusus tentang tujuan Rekam Medis Elektronik untuk secara aktif terlibat dalam proses pengambilan keputusan Rekam Medis Elektronik dan menentukan persyaratan infrastruktur TI yang diperlukan" },
        ],
      },
    ],
  },
  {
    nama: "Infrastruktur TI",
    warna: "slate",
    pertanyaan: [
      {
        id: 27,
        teks: "Bagaimana tingkat penilaian kebutuhan perangkat keras, terminal desktop, dan perangkat pendukung lainnya untuk mendukung implementasi dan penggunaan Rekam Medis Elektronik (RME)?",
        pilihan: [
          { nilai: 0, teks: "Tidak dipahami" },
          { nilai: 1, teks: "Secara umum dipahami tetapi belum dievaluasi" },
          { nilai: 2, teks: "Telah dilakukan tetapi tidak didokumentasikan dalam proses perencanaan" },
          { nilai: 3, teks: "Telah dilakukan dan didokumentasikan dalam proses perencanaan" },
          { nilai: 4, teks: "Telah dilakukan tetapi persyaratan belum termasuk dalam proses perencanaan" },
          { nilai: 5, teks: "Telah dilakukan dan persyaratan termasuk dalam proses perencanaan" },
        ],
      },
    ],
  },
];

export function hitungKategori(skor: number): { label: string; warna: string } {
  if (skor <= 1) return { label: "Belum Siap", warna: "red" };
  if (skor <= 3) return { label: "Cukup Siap", warna: "yellow" };
  return { label: "Sangat Siap", warna: "green" };
}

export function hitungSkorDomain(domain: Domain, jawaban: Record<number, number>) {
  const total = domain.pertanyaan.reduce((sum, p) => sum + (jawaban[p.id] ?? 0), 0);
  const rata = domain.pertanyaan.length > 0 ? total / domain.pertanyaan.length : 0;
  return rata;
}

/**
 * Skor kesiapan keseluruhan = rata-rata dari skor rata-rata tiap domain.
 * Setiap domain berbobot sama (bukan setiap soal), sehingga domain dengan
 * jumlah soal berbeda tetap berkontribusi setara. Hasil dibulatkan 2 desimal.
 */
export function hitungSkorKeseluruhan(jawaban: Record<number, number>): number {
  if (DOMAINS.length === 0) return 0;
  const totalDomain = DOMAINS.reduce((sum, d) => sum + hitungSkorDomain(d, jawaban), 0);
  const rata = totalDomain / DOMAINS.length;
  return Math.round(rata * 100) / 100;
}

export const TOTAL_PERTANYAAN = DOMAINS.reduce((sum, d) => sum + d.pertanyaan.length, 0);
