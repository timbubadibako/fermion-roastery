# Project Rules

## Core Principle
`.brains` adalah sumber dokumentasi strategis utama dan strict source of truth untuk project Fermion Roastery.

## Source and Mirror
- Di repo project, sumber utama dokumentasi strategis adalah `.brains`.
- Di Obsidian, mirror strategis boleh disimpan dalam `_brains`.
- Agent project harus memperlakukan `.brains` sebagai source of truth.
- Agent Obsidian membaca `.brains` lalu membuat representasi turunan seperti briefing, notes, atau tracker.

## Required Read Order
Sebelum pekerjaan besar, agent wajib membaca:
1. `project.md`
2. `current-status.md`
3. `todo.md`
4. `handoff.md`
5. `rules.md`
6. `agent-prompt.md`

Jika pekerjaan menyentuh arsitektur atau integrasi, agent juga wajib membaca:
- `architecture.md`
- `decisions.md`
- `context/technical.md`
- `context/integrations.md`

## Structure Protection
Agent dilarang:
- menghapus folder `.brains`
- memindahkan lokasi `.brains`
- mengganti nama file wajib
- menghapus file wajib
- membuat struktur alternatif yang menyaingi `.brains`

## Update Contract
Agent wajib update `.brains` saat:
- memulai pekerjaan besar
- selesai pekerjaan besar
- menemukan blocker penting
- mengubah prioritas
- membuat keputusan arsitektural atau produk
- menyerahkan pekerjaan ke agent atau manusia lain

## Minimum Update Rules
Setelah sesi kerja substantif, agent minimal harus memperbarui:
- `current-status.md`
- `todo.md`
- `handoff.md`

## Writing Rules
Agent harus:
- menulis ringkas dan spesifik
- menulis item todo yang actionable
- menulis blocker dengan dampak jelas
- menulis keputusan beserta alasan dan konsekuensi
- membedakan hal yang sudah terkonfirmasi dan yang belum tervalidasi

Agent tidak boleh:
- menyalin log terminal mentah panjang
- membuat todo yang kabur
- menyimpan konteks penting hanya di chat

## Obsidian Sync Intent
Dokumen strategis di `.brains` akan dibaca agent Obsidian untuk briefing harian dan dapat dicerminkan ke `_brains`. Karena itu, utamakan kejelasan, status yang tegas, dan perubahan yang mudah dilacak.
