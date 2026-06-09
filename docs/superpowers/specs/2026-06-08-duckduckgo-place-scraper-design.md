# Design Spec: DuckDuckGo Place Scraper (B2B Discovery)

**Status:** Draft / Pending Review
**Date:** 2026-06-08
**Topic:** Scraping Alternative for Google Places API

---

## 1. Overview
Due to restrictions with the Google Places API, Fermion Roastery requires a reliable, free, and unlimited method for B2B partners to discover and link their business locations during registration. We will implement a custom scraper that leverages the DuckDuckGo (DDG) HTML interface.

### Success Criteria
- 100% free and unlimited business discovery.
- Accurate extraction of Business Name and Address.
- Intelligent parsing of City and Province via Regex.
- Interactive "Card-based" selection UI in the frontend.

---

## 2. Technical Architecture

### Backend (Express v5)
- **Scraper Engine:** Uses `axios` for HTTP requests and `cheerio` for HTML parsing.
- **Source:** `https://html.duckduckgo.com/html/` (Non-JS version).
- **Query Strategy:** Automatically appends keywords like "address" and "indonesia" to user input to prioritize business listings.

### API Endpoint
- **Path:** `GET /api/places/search`
- **Params:** `?q=[keyword]`
- **Response Format:**
    ```json
    [
      {
        "id": "uuid-generated",
        "name": "Arunika Eatery",
        "address": "Jl. Cigugur, Kuningan, Jawa Barat",
        "city": "Kuningan",
        "province": "Jawa Barat"
      }
    ]
    ```

---

## 3. Data Parsing Logic (Regex)
The scraper will use a priority-based parsing strategy to clean the raw "Snippet" from DDG:
1. **Name:** Extracted from the search result title.
2. **Address:** Extracted from the result snippet.
3. **Location Extraction:** Uses a list of common Indonesian provinces and city keywords (e.g., "Kabupaten", "Kota") to isolate geographical data.

---

## 4. Frontend UI/UX (Next.js)
- **Search Trigger:** User enters keyword and clicks "SEARCH".
- **Result Cards:** Displays a vertical list of 3-5 results with:
    - Business Name (Bold)
    - Full Address (Subtle)
    - Selection Action (On Click)
- **State Integration:** Selecting a card auto-fills the `cafeName` and `cafeAddress` fields in the registration form and clears the results list.

---

## 5. Security & Stability
- **User-Agent Rotation:** Basic rotation of headers to prevent DDG from identifying the scraper as a bot.
- **Timeout Management:** Frontend will handle a 5-second timeout gracefully by suggesting "Manual Input".
- **Fallback:** "Manual Input" remains always visible if the scraper fails or returns zero results.

---

## 6. Implementation Roadmap
1. **Backend:** Install `cheerio` and create `placesController.js`.
2. **Backend:** Register `/api/places/search` route.
3. **Frontend:** Update `B2BRegisterPage` to call the new API and render the List Cards.
4. **Validation:** Test with various cafe names (local and national).
