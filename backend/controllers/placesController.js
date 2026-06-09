import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const CACHE_PATH = path.resolve('data/places_cache.json');

/**
 * Robust Place Search using a Quad-Layer strategy:
 * 1. Local Cache - Instantly returns pre-scraped local cafes (Cirebon, Kuningan, Majalengka).
 * 2. Nominatim (OpenStreetMap) - Fast, structured, free.
 * 3. Google Search Scraping - Fallback for newer/unlisted places.
 * 4. Smart Mocks - Safety net for UI flow.
 */
export const searchPlaces = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  let results = [];

  try {
    // --- LAYER 0: LOCAL CACHE (Cirebon Radius 100km) ---
    if (fs.existsSync(CACHE_PATH)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
      const searchTerms = q.toLowerCase().split(' ');
      
      const matched = cacheData.filter(item => 
        searchTerms.every(term => 
          item.name.toLowerCase().includes(term) || 
          item.city.toLowerCase().includes(term)
        )
      );

      if (matched.length > 0) {
        console.log(`✅ Found ${matched.length} results from Local Cache`);
        results = matched.map(m => ({ ...m, source: 'cache' }));
      }
    }

    // If cache doesn't have enough results, proceed to online sources
    if (results.length < 3) {
      // --- LAYER 1: NOMINATIM (OpenStreetMap) ---
      console.log(`🔍 Layer 1: Searching Nominatim for "${q}"`);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' cafe coffee restaurant indonesia')}&format=json&addressdetails=1&limit=10`;
      
      const osmResponse = await axios.get(nominatimUrl, {
        headers: { 'User-Agent': 'FermionRoastery/1.0 (contact@fermion.com)' }
      });

      if (osmResponse.data && osmResponse.data.length > 0) {
        const filteredOsm = osmResponse.data.filter(item => {
          const type = (item.type || '').toLowerCase();
          const category = (item.class || '').toLowerCase();
          const displayName = (item.display_name || '').toLowerCase();
          
          return category === 'amenity' && (
            type.includes('cafe') || 
            type.includes('restaurant') || 
            type.includes('coffee') || 
            type.includes('food') || 
            type.includes('bar') ||
            displayName.includes('kopi') ||
            displayName.includes('cafe')
          );
        });

        const osmResults = (filteredOsm.length > 0 ? filteredOsm : osmResponse.data.slice(0, 5)).map((item, i) => ({
          id: `osm-${i}-${Date.now()}`,
          name: item.name || item.display_name.split(',')[0],
          address: item.display_name,
          city: item.address?.city || item.address?.town || item.address?.county || "",
          province: item.address?.state || "",
          source: 'osm'
        }));
        results = [...results, ...osmResults];
        console.log(`✅ Found ${osmResults.length} filtered results from Nominatim`);
      }
    }

    // --- LAYER 2: GOOGLE SCRAPING (Fallback if still not enough) ---
    if (results.length < 3) {
      console.log(`🔍 Layer 2: Trying Google Scraper fallback`);
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(q + ' "coffee shop" OR "cafe" OR "restaurant" address indonesia')}`;
      
      const gResponse = await axios.get(googleUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' },
        timeout: 3000
      });

      const $ = cheerio.load(gResponse.data);
      const googleResults = [];
      $('.g').each((i, element) => {
        if (i >= 3) return;
        const name = $(element).find('h3').text().trim();
        const rawAddress = $(element).find('.VwiC3b').text().trim() || $(element).find('.kb0Bcb').text().trim();
        
        if (name && rawAddress) {
          googleResults.push({
            id: `google-${i}-${Date.now()}`,
            name: name,
            address: rawAddress.substring(0, 150) + "...",
            city: "Search Result",
            province: "",
            source: 'google'
          });
        }
      });
      results = [...results, ...googleResults];
      if (googleResults.length > 0) console.log(`✅ Found ${googleResults.length} results from Google Scraper`);
    }

    // --- LAYER 3: SMART MOCKS (Final Safety Net) ---
    if (results.length === 0) {
      console.log(`⚠️ All sources empty, returning Smart Mock`);
      results.push({ 
        id: 'mock-1', 
        name: `${q.toUpperCase()}`, 
        address: 'Lokasi tidak ditemukan secara otomatis. Klik di sini untuk mengisi manual.', 
        city: '', 
        province: '',
        isMock: true,
        source: 'mock'
      });
    }

    // Deduplicate and limit to top 5
    const uniqueResults = Array.from(new Map(results.map(item => [item.name, item])).values()).slice(0, 5);
    res.status(200).json(uniqueResults);

  } catch (error) {
    console.error('Search Strategy Error:', error.message);
    res.status(200).json([{ 
      id: 'error-mock', 
      name: `${q.toUpperCase()}`, 
      address: 'Pencarian sedang sibuk. Klik di sini untuk mengisi manual.', 
      city: '', 
      province: '',
      isMock: true,
      source: 'error-fallback'
    }]);
  }
};
