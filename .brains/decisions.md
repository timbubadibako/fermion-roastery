# Decisions

- Date: 2026-07-04
  Decision: `.brains` ditetapkan sebagai strict source of truth strategis project.
  Why: owner ingin agent coding dan agent Obsidian membaca sumber konteks yang sama tanpa bergantung pada chat.
  Consequence: setiap pekerjaan besar harus ikut memperbarui `.brains`, minimal `current-status.md`, `todo.md`, dan `handoff.md`.

- Date: 2026-07-04
  Decision: web Fermion diposisikan sebagai owned marketplace yang mengurangi ketergantungan pada marketplace pihak ketiga.
  Why: fee admin marketplace umum dipandang terlalu tinggi dan web sendiri memberi kesan brand yang lebih serius.
  Consequence: prioritas project harus menekankan trust, performance, conversion, dan operational readiness.

- Date: 2026-07-04
  Decision: baseline `.brains` harus jujur terhadap hal yang belum tervalidasi, terutama readiness payment dan kualitas produksi.
  Why: repo dapat terlihat lengkap secara teknis tetapi tetap menyimpan risiko nyata di flow transaksi, media, atau deploy.
  Consequence: gunakan label seperti `confirmed`, `planned`, dan `not yet validated` saat menulis konteks strategis.
