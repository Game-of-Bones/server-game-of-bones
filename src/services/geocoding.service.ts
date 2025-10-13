// backend/src/services/geocoding.service.ts

import axios from 'axios';

/**
 * Interface para el resultado de geocodificación
 */
interface GeocodingResult {
  latitude: number;
  longitude: number;
}

/**
 * Geocodifica una ubicación de texto a coordenadas (lat, lng)
 * usando Nominatim (OpenStreetMap) - 100% gratuito
 * 
 * @param location - Ubicación como texto (ej: "Neuquén, Argentina")
 * @returns Coordenadas {latitude, longitude} o null si no se encuentra
 * 
 * IMPORTANTE: 
 * - Nominatim requiere un User-Agent personalizado
 * - Máximo 1 petición por segundo (para ser respetuoso con el servicio)
 * - No hacer geocodificación en bucles rápidos
 * 
 * Ejemplos de uso:
 * - geocodeLocation("Neuquén, Argentina")
 * - geocodeLocation("Montana, USA")
 * - geocodeLocation("Hell Creek Formation, Montana")
 */
export async function geocodeLocation(location: string): Promise<GeocodingResult | null> {
  try {
    // Si la ubicación está vacía, retornar null
    if (!location || location.trim() === '') {
      return null;
    }

    console.log(`🌍 Geocodificando ubicación: "${location}"`);

    // Interface para tipar la respuesta de Nominatim
    interface NominatimResult {
      lat: string;
      lon: string;
      display_name: string;
      [key: string]: any;
    }

    // Petición a Nominatim (OpenStreetMap)
    const response = await axios.get<NominatimResult[]>('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1, // Solo necesitamos el primer resultado
        addressdetails: 1 // Incluir detalles de dirección
      },
      headers: {
        // CRÍTICO: Nominatim requiere un User-Agent único
        // Cambia esto por el nombre de tu aplicación
        'User-Agent': 'GameOfBones/1.0 (contact@gameofbones.com)'
      },
      timeout: 5000 // 5 segundos de timeout
    });

    // Si encontramos resultados
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      
      const coordinates = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      };

      console.log(`✅ Coordenadas encontradas: [${coordinates.latitude}, ${coordinates.longitude}]`);
      
      return coordinates;
    }

    // No se encontraron resultados
    console.warn(`⚠️ No se encontraron coordenadas para: "${location}"`);
    return null;

  } catch (error: any) {
    // Manejo de errores
    if (error.response) {
      console.error(`❌ Error en Nominatim (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.error('❌ No se recibió respuesta de Nominatim:', error.message);
    } else {
      console.error('❌ Error al geocodificar:', error.message);
    }
    
    return null;
  }
}

/**
 * Geocodifica múltiples ubicaciones con delay entre peticiones
 * para respetar el límite de Nominatim (1 req/segundo)
 * 
 * @param locations - Array de ubicaciones como texto
 * @returns Array de resultados (puede contener null para ubicaciones no encontradas)
 */
export async function geocodeMultipleLocations(
  locations: string[]
): Promise<(GeocodingResult | null)[]> {
  const results: (GeocodingResult | null)[] = [];

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    
    // Geocodificar la ubicación
    const result = await geocodeLocation(location);
    results.push(result);

    // Esperar 1.1 segundos entre peticiones para respetar el límite de Nominatim
    if (i < locations.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  }

  return results;
}

/**
 * Cache simple en memoria para evitar geocodificar la misma ubicación múltiples veces
 * En producción, considera usar Redis o similar
 */
const geocodingCache = new Map<string, GeocodingResult | null>();

/**
 * Geocodifica con cache para optimizar peticiones repetidas
 */
export async function geocodeLocationWithCache(location: string): Promise<GeocodingResult | null> {
  // Normalizar la ubicación (trim, lowercase) para la cache
  const normalizedLocation = location.trim().toLowerCase();

  // Verificar si ya está en cache
  if (geocodingCache.has(normalizedLocation)) {
    console.log(`💾 Coordenadas obtenidas de cache para: "${location}"`);
    return geocodingCache.get(normalizedLocation)!;
  }

  // Geocodificar y guardar en cache
  const result = await geocodeLocation(location);
  geocodingCache.set(normalizedLocation, result);

  return result;
}

/**
 * Limpiar la cache (útil para tests o mantenimiento)
 */
export function clearGeocodingCache(): void {
  geocodingCache.clear();
  console.log('🗑️ Cache de geocodificación limpiada');
}