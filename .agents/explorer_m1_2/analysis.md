# B2B Localization Analysis Report

## Summary of Findings
We have successfully analyzed the frontend pages `frontend/app/b2b/register/page.tsx` and `frontend/app/b2b/contract/page.tsx` for hardcoded strings. A total of 20 unique hardcoded strings (including buttons, placeholders, toast notifications, headings, and labels) were identified and mapped to clean, professional translation structures for English and Indonesian, strictly avoiding restricted terms like "ritual".

---

## 1. Hardcoded Texts in `frontend/app/b2b/register/page.tsx`

| Line | Hardcoded String | Context / Code Snippet | Type |
|------|------------------|------------------------|------|
| 55   | `"Partnership details saved."` | `toast.success("Partnership details saved.");` | Toast Message |
| 58   | `"Registration failed"` | `toast.error("Registration failed");` | Toast Message |
| 60   | `"Network error"` | `toast.error("Network error");` | Toast Message |
| 82   | `"FERMION."` | `<h1 className="text-xl font-black italic ...">FERMION.</h1>` | Logo / Brand |
| 85   | `"BACK"` | `<button ...><ArrowLeft ... /> BACK</button>` | Button Label |
| 92   | `"Partner Access."` | `{step === 1 ? "Partner Access." : "Roastery Profile."}` | Heading (Step 1) |
| 92   | `"Roastery Profile."` | `{step === 1 ? "Partner Access." : "Roastery Profile."}` | Heading (Step 2) |
| 95   | `"Secure your credentials."` | `{step === 1 ? "Secure your credentials." : "Define your needs."}` | Sub-heading (Step 1) |
| 95   | `"Define your needs."` | `{step === 1 ? "Secure your credentials." : "Define your needs."}` | Sub-heading (Step 2) |
| 119  | `"Cafe / Company Name"` | `<label ...>Cafe / Company Name</label>` | Form Label |
| 120  | `"e.g. Lab Kopi"` | `<Input ... placeholder="e.g. Lab Kopi" ... />` | Input Placeholder |
| 123  | `"WhatsApp Number"` | `<label ...>WhatsApp Number</label>` | Form Label |
| 124  | `"08..."` | `<Input ... placeholder="08..." ... />` | Input Placeholder |
| 127  | `"Full Address"` | `<label ...>Full Address</label>` | Form Label |
| 128  | `"Street, City..."` | `<Input ... placeholder="Street, City..." ... />` | Input Placeholder |
| 134  | `"Artisan"` | `{ val: "10-20KG", icon: Coffee, title: "Artisan" }` | Option Card Title |
| 135  | `"Growth"` | `{ val: "20-50KG", icon: Zap, title: "Growth" }` | Option Card Title |
| 136  | `"Scale"` | `{ val: "50KG+", icon: Star, title: "Scale" }` | Option Card Title |
| 149  | `"10-20KG"`, `"20-50KG"`, `"50KG+"` | `val` attributes rendering volume values | Option Card Subtext |
| 155  | `"Prepare Partnership"` | `<span className="flex items-center gap-2">Prepare Partnership <ArrowRight ... /></span>` | Submit Button |

---

## 2. Hardcoded Texts in `frontend/app/b2b/contract/page.tsx`

| Line | Hardcoded String | Context / Code Snippet | Type |
|------|------------------|------------------------|------|
| 43   | `"Contract uploaded successfully"` | `toast.success("Contract uploaded successfully");` | Toast Message |
| 47   | `"Upload failed"` | `toast.error("Upload failed");` | Toast Message |
| 73   | `"FERMION."` | `<h1 className="text-xl font-black italic ...">FERMION.</h1>` | Logo / Brand |
| 76   | `"BACK"` | `<button ...><ArrowLeft ... /> BACK</button>` | Button Label |
| 83   | `"Contract Protocol."` | `<h2 className="...">Contract Protocol.</h2>` (Left Panel) | Heading (Panel) |
| 86   | `"Legal finalization."` | `<p className="...">Legal finalization.</p>` (Left Panel) | Sub-heading (Panel) |
| 102  | `"Contract Protocol."` | `<h2 className="...">Contract Protocol.</h2>` (Card Inner) | Heading (Card) |
| 103  | `"Legal Finalization"` | `<p className="...">Legal Finalization</p>` (Card Inner) | Sub-heading (Card) |
| 105  | `"Your partnership agreement is ready. Please download, sign, and upload to finalize your lab access."` | `<p className="...">"Your partnership agreement is ready. Please download, sign, and upload to finalize your lab access."</p>` | Main Paragraph |
| 115  | `"Download Contract PDF"` | `<Download ... /> Download Contract PDF` | Button Label |
| 122  | `"Uploading..."` | `uploading ? "Uploading..." : "Drop or Click to Upload"` | Upload Label (Active) |
| 122  | `"Drop or Click to Upload"` | `uploading ? "Uploading..." : "Drop or Click to Upload"` | Upload Label (Idle) |
| 123  | `"Accepted Format: PDF Only (Max 5MB)"` | `<p className="...">Accepted Format: PDF Only (Max 5MB)</p>` | Hint / Subtext |

---

## 3. Suggested Translation Keys (JSON Format)

We recommend dividing the translation keys into two distinct scopes: `b2bRegister` and `b2bContract`. These can be loaded under their respective page component imports or globally.

```json
{
  "b2bRegister": {
    "logo": "FERMION.",
    "back": "BACK",
    "step1Heading": "Partner Access.",
    "step2Heading": "Roastery Profile.",
    "step1Subheading": "Secure your credentials.",
    "step2Subheading": "Define your needs.",
    "form": {
      "cafeNameLabel": "Cafe / Company Name",
      "cafeNamePlaceholder": "e.g. Lab Kopi",
      "phoneLabel": "WhatsApp Number",
      "phonePlaceholder": "08...",
      "addressLabel": "Full Address",
      "addressPlaceholder": "Street, City...",
      "options": {
        "artisanTitle": "Artisan",
        "growthTitle": "Growth",
        "scaleTitle": "Scale"
      },
      "submitButton": "Prepare Partnership"
    },
    "toasts": {
      "success": "Partnership details saved.",
      "error": "Registration failed",
      "networkError": "Network error"
    }
  },
  "b2bContract": {
    "logo": "FERMION.",
    "back": "BACK",
    "heading": "Contract Protocol.",
    "subheading": "Legal finalization.",
    "card": {
      "heading": "Contract Protocol.",
      "subheading": "Legal Finalization",
      "description": "Your partnership agreement is ready. Please download, sign, and upload to finalize your lab access.",
      "downloadButton": "Download Contract PDF",
      "upload": {
        "idle": "Drop or Click to Upload",
        "uploading": "Uploading...",
        "hint": "Accepted Format: PDF Only (Max 5MB)"
      }
    },
    "toasts": {
      "success": "Contract uploaded successfully",
      "error": "Upload failed"
    }
  }
}
```

---

## 4. Proposed Translations (English vs. Indonesian)

Consistent with user constraints, the term "ritual" is completely avoided. "Partnership" is translated to "Kemitraan", and other terms are translated using clean, business-oriented wording.

### English (en)

```json
{
  "b2bRegister": {
    "logo": "FERMION.",
    "back": "BACK",
    "step1Heading": "Partner Access.",
    "step2Heading": "Roastery Profile.",
    "step1Subheading": "Secure your credentials.",
    "step2Subheading": "Define your needs.",
    "form": {
      "cafeNameLabel": "Cafe / Company Name",
      "cafeNamePlaceholder": "e.g. Lab Kopi",
      "phoneLabel": "WhatsApp Number",
      "phonePlaceholder": "08...",
      "addressLabel": "Full Address",
      "addressPlaceholder": "Street, City...",
      "options": {
        "artisanTitle": "Artisan",
        "growthTitle": "Growth",
        "scaleTitle": "Scale"
      },
      "submitButton": "Prepare Partnership"
    },
    "toasts": {
      "success": "Partnership details saved.",
      "error": "Registration failed",
      "networkError": "Network error"
    }
  },
  "b2bContract": {
    "logo": "FERMION.",
    "back": "BACK",
    "heading": "Contract Protocol.",
    "subheading": "Legal finalization.",
    "card": {
      "heading": "Contract Protocol.",
      "subheading": "Legal Finalization",
      "description": "Your partnership agreement is ready. Please download, sign, and upload to finalize your lab access.",
      "downloadButton": "Download Contract PDF",
      "upload": {
        "idle": "Drop or Click to Upload",
        "uploading": "Uploading...",
        "hint": "Accepted Format: PDF Only (Max 5MB)"
      }
    },
    "toasts": {
      "success": "Contract uploaded successfully",
      "error": "Upload failed"
    }
  }
}
```

### Indonesian (id)

```json
{
  "b2bRegister": {
    "logo": "FERMION.",
    "back": "KEMBALI",
    "step1Heading": "Akses Mitra.",
    "step2Heading": "Profil Roastery.",
    "step1Subheading": "Amankan kredensial Anda.",
    "step2Subheading": "Tentukan kebutuhan Anda.",
    "form": {
      "cafeNameLabel": "Nama Kafe / Perusahaan",
      "cafeNamePlaceholder": "c.b. Lab Kopi",
      "phoneLabel": "Nomor WhatsApp",
      "phonePlaceholder": "08...",
      "addressLabel": "Alamat Lengkap",
      "addressPlaceholder": "Jalan, Kota...",
      "options": {
        "artisanTitle": "Artisan",
        "growthTitle": "Growth",
        "scaleTitle": "Scale"
      },
      "submitButton": "Siapkan Kemitraan"
    },
    "toasts": {
      "success": "Detail kemitraan berhasil disimpan.",
      "error": "Pendaftaran gagal",
      "networkError": "Kesalahan jaringan"
    }
  },
  "b2bContract": {
    "logo": "FERMION.",
    "back": "KEMBALI",
    "heading": "Protokol Kontrak.",
    "subheading": "Finalisasi hukum.",
    "card": {
      "heading": "Protokol Kontrak.",
      "subheading": "Finalisasi Hukum",
      "description": "Dokumen perjanjian kemitraan Anda telah siap. Silakan unduh, tanda tangani, dan unggah untuk meresmikan akses lab Anda.",
      "downloadButton": "Unduh PDF Kontrak",
      "upload": {
        "idle": "Seret atau Klik untuk Mengunggah",
        "uploading": "Mengunggah...",
        "hint": "Format yang Diterima: Hanya PDF (Maks 5MB)"
      }
    },
    "toasts": {
      "success": "Kontrak berhasil diunggah",
      "error": "Gagal mengunggah"
    }
  }
}
```
