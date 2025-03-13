// Servicio para obtener y parsear listas M3U8 de canales IPTV

export interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  language?: string;
  country?: string;
  categories?: string[];
}

// Lista de URLs de listas M3U8 públicas
const IPTV_PLAYLIST_URLS = [
  // Listas generales con menos probabilidad de errores CORS
  'https://iptv-org.github.io/iptv/index.m3u',
  // Listas por categoría
  'https://iptv-org.github.io/iptv/categories/movies.m3u',
  'https://iptv-org.github.io/iptv/categories/entertainment.m3u',
  // Listas por idioma (español)
  'https://iptv-org.github.io/iptv/languages/spa.m3u',
  // Listas por país (España y países latinoamericanos)
  'https://iptv-org.github.io/iptv/countries/es.m3u',
  'https://iptv-org.github.io/iptv/countries/mx.m3u',
  'https://iptv-org.github.io/iptv/countries/ar.m3u',
  'https://iptv-org.github.io/iptv/countries/co.m3u',
  'https://iptv-org.github.io/iptv/countries/cl.m3u',
  'https://iptv-org.github.io/iptv/countries/pe.m3u',
];

// Lista de canales IPTV de respaldo (funcionan sin problemas de CORS)
const FALLBACK_IPTV_CHANNELS: IPTVChannel[] = [
  {
    id: 'iptv-horror-1',
    name: 'Terror TV',
    url: 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5d8d180092e97a5e107638d3/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1',
    logo: 'https://i.imgur.com/JnHVIRf.png',
    group: 'Terror',
    language: 'Español',
    country: 'España',
    categories: ['Terror', 'Películas']
  },
  {
    id: 'iptv-horror-2',
    name: 'Cine Terror Latino',
    url: 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5dcddf1ed95e740009fef7ab/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1',
    logo: 'https://i.imgur.com/30HzeQe.png',
    group: 'Terror',
    language: 'Español',
    country: 'Latinoamérica',
    categories: ['Terror', 'Películas', 'Latino']
  },
  {
    id: 'iptv-horror-3',
    name: 'Fear Factory',
    url: 'https://linear-82.frequency.stream/dist/localnow/82/hls/master/playlist.m3u8',
    logo: 'https://i.imgur.com/LMhvIny.png',
    group: 'Terror',
    language: 'Inglés',
    categories: ['Terror', 'Películas']
  },
  {
    id: 'iptv-horror-4',
    name: 'Sci-Fi TV',
    url: 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5f1ac8f49205650007bc15f1/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1',
    logo: 'https://i.imgur.com/vkWFnZe.png',
    group: 'Ciencia Ficción',
    language: 'Español',
    country: 'España',
    categories: ['Ciencia Ficción', 'Películas']
  },
  {
    id: 'iptv-horror-5',
    name: 'Runtime Thriller',
    url: 'https://linear-88.frequency.stream/dist/localnow/88/hls/master/playlist.m3u8',
    logo: 'https://i.imgur.com/K8YV2bR.png',
    group: 'Thriller',
    language: 'Español',
    categories: ['Thriller', 'Películas']
  },
  {
    id: 'iptv-horror-6',
    name: 'Cine Español',
    url: 'https://d2775x7js1jvw0.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-2vzmnn0a0ni14-prod/fast-channel-redbox-cine-espanol/fast-channel-redbox-cine-espanol.m3u8',
    logo: 'https://i.imgur.com/lQzG2lg.png',
    group: 'Cine',
    language: 'Español',
    country: 'España',
    categories: ['Cine', 'Películas']
  },
  {
    id: 'iptv-horror-7',
    name: 'Cine Latino',
    url: 'https://d2775x7js1jvw0.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-hlwsz0q9i43mf-prod/fast-channel-redbox-cine-latino/fast-channel-redbox-cine-latino.m3u8',
    logo: 'https://i.imgur.com/MJQrUAv.png',
    group: 'Cine',
    language: 'Español',
    country: 'Latinoamérica',
    categories: ['Cine', 'Películas', 'Latino']
  },
  // Canales adicionales que funcionan bien
  {
    id: 'iptv-horror-8',
    name: 'Scream Factory TV',
    url: 'https://amogonetworx-screamer-rakuten.amagi.tv/playlist.m3u8',
    logo: 'https://i.imgur.com/ZQb9Tct.png',
    group: 'Terror',
    language: 'Inglés',
    categories: ['Terror', 'Películas']
  },
  {
    id: 'iptv-horror-9',
    name: 'Cine de Terror 24/7',
    url: 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5cf968040ab7d8f181e6a68b/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1',
    logo: 'https://i.imgur.com/QgWlYv1.png',
    group: 'Terror',
    language: 'Español',
    country: 'España',
    categories: ['Terror', 'Películas']
  },
  {
    id: 'iptv-horror-10',
    name: 'Dark Matter TV',
    url: 'https://dmtv-plex.amagi.tv/playlist.m3u8',
    logo: 'https://i.imgur.com/89Gpkz7.png',
    group: 'Terror',
    language: 'Inglés',
    categories: ['Terror', 'Películas']
  },
  {
    id: 'iptv-horror-11',
    name: 'Cine Suspenso',
    url: 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5ddc4e8bcbb9010009b4e84f/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1',
    logo: 'https://i.imgur.com/G9nYMdl.png',
    group: 'Suspenso',
    language: 'Español',
    country: 'Latinoamérica',
    categories: ['Suspenso', 'Películas']
  },
  {
    id: 'iptv-horror-12',
    name: 'Cine Adrenalina',
    url: 'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5d8d164d92e97a5e107638d2/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1',
    logo: 'https://i.imgur.com/QG8aSHd.png',
    group: 'Acción',
    language: 'Español',
    country: 'España',
    categories: ['Acción', 'Películas']
  }
];

import axios from 'axios';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

/**
 * Parsea una lista M3U8 y extrae los canales
 * @param content Contenido de la lista M3U8
 * @returns Array de canales IPTV
 */
export const parseM3U8 = (content: string): IPTVChannel[] => {
  try {
    console.log('Parseando lista M3U8...');
    const channels: IPTVChannel[] = [];
    const lines = content.split('\n');
    
    let currentChannel: Partial<IPTVChannel> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Inicio de un nuevo canal
      if (line.startsWith('#EXTINF:')) {
        currentChannel = {};
        
        // Extraer nombre del canal
        const nameMatch = line.match(/tvg-name="([^"]*)"/) || line.match(/,(.*)$/);
        if (nameMatch && nameMatch[1]) {
          currentChannel.name = nameMatch[1].trim();
        }
        
        // Extraer logo
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        if (logoMatch && logoMatch[1]) {
          currentChannel.logo = logoMatch[1];
        }
        
        // Extraer grupo
        const groupMatch = line.match(/group-title="([^"]*)"/);
        if (groupMatch && groupMatch[1]) {
          currentChannel.group = groupMatch[1];
        }
        
        // Extraer idioma
        const languageMatch = line.match(/tvg-language="([^"]*)"/);
        if (languageMatch && languageMatch[1]) {
          currentChannel.language = languageMatch[1];
        }
        
        // Extraer país
        const countryMatch = line.match(/tvg-country="([^"]*)"/);
        if (countryMatch && countryMatch[1]) {
          currentChannel.country = countryMatch[1];
        }
        
        // Extraer categorías
        const categoriesMatch = line.match(/tvg-tags="([^"]*)"/);
        if (categoriesMatch && categoriesMatch[1]) {
          currentChannel.categories = categoriesMatch[1].split(',').map(cat => cat.trim());
        }
        
        // Si no se encontró un nombre, intentar extraerlo del final de la línea
        if (!currentChannel.name) {
          const commaIndex = line.lastIndexOf(',');
          if (commaIndex !== -1) {
            currentChannel.name = line.substring(commaIndex + 1).trim();
          }
        }
      } 
      // URL del canal
      else if (line.startsWith('http') && currentChannel) {
        currentChannel.url = line;
        currentChannel.id = `iptv-${channels.length + 1}`;
        
        // Solo agregar canales con nombre y URL
        if (currentChannel.name && currentChannel.url) {
          channels.push(currentChannel as IPTVChannel);
        }
        
        currentChannel = null;
      }
    }
    
    console.log(`Se encontraron ${channels.length} canales en la lista M3U8`);
    return channels;
  } catch (error) {
    console.error('Error al parsear la lista M3U8:', error);
    return [];
  }
};

/**
 * Descarga y parsea una lista M3U8 desde una URL
 * @param url URL de la lista M3U8
 * @returns Promise con array de canales IPTV
 */
export const fetchAndParseM3U8 = async (url: string): Promise<IPTVChannel[]> => {
  try {
    console.log(`Descargando lista M3U8 desde ${url}...`);
    
    // Intentar con fetch normal primero
    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.status >= 200 && response.status < 300) {
        const content = response.data;
        return parseM3U8(content);
      } else {
        throw new Error(`Error al descargar la lista M3U8: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error al descargar la lista M3U8: ${error}, intentando con proxy...`);
      
      // Intentar con un proxy CORS como alternativa
      try {
        console.log(`Intentando con proxy CORS para ${url}...`);
        const corsProxyUrl = `https://cors.zimjs.com/${url}`;
        
        const proxyResponse = await axios.get(corsProxyUrl, { 
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (proxyResponse.status >= 200 && proxyResponse.status < 300) {
          const content = proxyResponse.data;
          return parseM3U8(content);
        } else {
          throw new Error(`Error al usar proxy CORS: ${proxyResponse.status} ${proxyResponse.statusText}`);
        }
      } catch (proxyError) {
        console.error(`Error al usar proxy CORS para ${url}:`, proxyError);
        return [];
      }
    }
  } catch (error) {
    console.error(`Error al descargar o parsear la lista M3U8 desde ${url}:`, error);
    
    // Intentar con un proxy CORS como alternativa
    try {
      console.log(`Intentando con proxy CORS para ${url}...`);
      const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      
      const altProxyResponse = await axios.get(corsProxyUrl, { 
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (altProxyResponse.status >= 200 && altProxyResponse.status < 300) {
        const content = altProxyResponse.data;
        return parseM3U8(content);
      } else {
        throw new Error(`Error al usar proxy CORS alternativo: ${altProxyResponse.status} ${altProxyResponse.statusText}`);
      }
    } catch (altProxyError) {
      console.error(`Error al usar proxy CORS alternativo para ${url}:`, altProxyError);
      
      // Intentar con un proxy CORS de respaldo
      try {
        console.log(`Intentando con proxy CORS de respaldo para ${url}...`);
        const backupProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
        
        const backupProxyResponse = await axios.get(backupProxyUrl, { 
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://example.com'
          }
        });
        
        if (backupProxyResponse.status >= 200 && backupProxyResponse.status < 300) {
          const content = backupProxyResponse.data;
          return parseM3U8(content);
        } else {
          throw new Error(`Error al usar proxy CORS de respaldo: ${backupProxyResponse.status} ${backupProxyResponse.statusText}`);
        }
      } catch (backupProxyError) {
        console.error(`Error al usar proxy CORS de respaldo para ${url}:`, backupProxyError);
        return [];
      }
    }
  }
};

/**
 * Filtra canales por categoría o términos de búsqueda
 * @param channels Lista de canales
 * @param category Categoría para filtrar
 * @param searchTerms Términos de búsqueda
 * @returns Canales filtrados
 */
export const filterChannels = (
  channels: IPTVChannel[], 
  category?: string, 
  searchTerms?: string
): IPTVChannel[] => {
  try {
    let filtered = [...channels];
    
    // Filtrar por categoría
    if (category) {
      const lowerCategory = category.toLowerCase();
      filtered = filtered.filter(channel => 
        (channel.group && channel.group.toLowerCase().includes(lowerCategory)) ||
        (channel.categories && channel.categories.some(cat => cat.toLowerCase().includes(lowerCategory)))
      );
    }
    
    // Filtrar por términos de búsqueda
    if (searchTerms) {
      const terms = searchTerms.toLowerCase().split(' ');
      filtered = filtered.filter(channel => {
        const channelText = `${channel.name} ${channel.group || ''} ${channel.language || ''} ${channel.country || ''} ${channel.categories?.join(' ') || ''}`.toLowerCase();
        return terms.every(term => channelText.includes(term));
      });
    }
    
    console.log(`Filtrado: ${filtered.length} canales coinciden con los criterios`);
    return filtered;
  } catch (error) {
    console.error('Error al filtrar canales:', error);
    return channels;
  }
};

/**
 * Obtiene canales de películas y series de las listas IPTV
 * @param category Categoría específica (opcional)
 * @param limit Límite de canales a devolver
 * @returns Promise con array de canales IPTV
 */
export const fetchMovieChannels = async (
  category?: string, 
  limit: number = 20
): Promise<IPTVChannel[]> => {
  try {
    console.log('Obteniendo canales de películas...');
    
    // Intentar obtener canales de las listas M3U8
    const fetchPromises = IPTV_PLAYLIST_URLS.map(url => fetchAndParseM3U8(url));
    const results = await Promise.allSettled(fetchPromises);
    
    // Combinar todos los canales de las listas
    let allChannels: IPTVChannel[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Lista ${index + 1}: Se obtuvieron ${result.value.length} canales`);
        allChannels = [...allChannels, ...result.value];
      } else {
        console.error(`Error al obtener canales de la lista ${index + 1}:`, result.reason);
      }
    });
    
    // Eliminar duplicados basados en URL
    const uniqueChannels = Array.from(
      new Map(allChannels.map(channel => [channel.url, channel])).values()
    );
    
    console.log(`Total de canales únicos: ${uniqueChannels.length}`);
    
    // Filtrar canales de películas y series
    const movieKeywords = ['movie', 'film', 'cinema', 'pelicula', 'película', 'cine', 'drama', 'comedy', 'comedia', 'thriller', 'horror', 'terror', 'sci-fi', 'ciencia ficcion', 'action', 'accion', 'acción'];
    
    const movieChannels = uniqueChannels.filter(channel => {
      const channelText = `${channel.name} ${channel.group || ''} ${channel.categories?.join(' ') || ''}`.toLowerCase();
      return movieKeywords.some(keyword => channelText.includes(keyword));
    });
    
    console.log(`Canales de películas encontrados: ${movieChannels.length}`);
    
    // Filtrar por categoría específica si se proporciona
    let filteredChannels = category 
      ? filterChannels(movieChannels, category)
      : movieChannels;
    
    // Si no se encontraron canales o son muy pocos, usar los canales de respaldo
    if (filteredChannels.length < 5) {
      console.log('Usando canales de respaldo...');
      
      const fallbackFiltered = category 
        ? filterChannels(FALLBACK_IPTV_CHANNELS, category)
        : FALLBACK_IPTV_CHANNELS;
      
      // Combinar con los canales encontrados (si hay alguno)
      filteredChannels = [...filteredChannels, ...fallbackFiltered];
      
      // Eliminar duplicados nuevamente
      filteredChannels = Array.from(
        new Map(filteredChannels.map(channel => [channel.url, channel])).values()
      );
    }
    
    // Limitar el número de canales
    const limitedChannels = filteredChannels.slice(0, limit);
    
    console.log(`Devolviendo ${limitedChannels.length} canales de películas`);
    return limitedChannels;
  } catch (error) {
    console.error('Error al obtener canales de películas:', error);
    
    // En caso de error, devolver canales de respaldo
    console.log('Devolviendo canales de respaldo debido a un error');
    const fallbackFiltered = category 
      ? filterChannels(FALLBACK_IPTV_CHANNELS, category)
      : FALLBACK_IPTV_CHANNELS;
    
    return fallbackFiltered.slice(0, limit);
  }
};

/**
 * Obtiene canales específicos de terror
 * @param limit Límite de canales a devolver
 * @returns Promise con array de canales IPTV de terror
 */
export const fetchHorrorChannels = async (limit: number = 10): Promise<IPTVChannel[]> => {
  try {
    console.log('Obteniendo canales de terror...');
    
    // Intentar obtener canales de terror de las listas
    const horrorChannels = await fetchMovieChannels('terror', limit);
    
    // Si no se encontraron suficientes canales de terror, buscar con términos relacionados
    if (horrorChannels.length < limit / 2) {
      console.log('Buscando canales con términos relacionados al terror...');
      
      // Términos relacionados al terror
      const horrorTerms = ['horror', 'terror', 'scary', 'miedo', 'suspense', 'suspenso', 'thriller', 'paranormal', 'zombies', 'monsters', 'monstruos', 'supernatural', 'sobrenatural'];
      
      // Obtener canales para cada término
      const termPromises = horrorTerms.map(term => fetchMovieChannels(term, Math.ceil(limit / horrorTerms.length)));
      const results = await Promise.allSettled(termPromises);
      
      // Combinar todos los canales encontrados
      let additionalChannels: IPTVChannel[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Término ${horrorTerms[index]}: Se obtuvieron ${result.value.length} canales`);
          additionalChannels = [...additionalChannels, ...result.value];
        }
      });
      
      // Combinar con los canales de terror ya encontrados
      let allHorrorChannels = [...horrorChannels, ...additionalChannels];
      
      // Eliminar duplicados
      allHorrorChannels = Array.from(
        new Map(allHorrorChannels.map(channel => [channel.url, channel])).values()
      );
      
      console.log(`Total de canales de terror: ${allHorrorChannels.length}`);
      
      // Si aún no hay suficientes canales, usar los canales de respaldo
      if (allHorrorChannels.length < limit) {
        console.log('Agregando canales de respaldo de terror...');
        
        // Filtrar canales de respaldo relacionados con terror
        const horrorFallbackChannels = FALLBACK_IPTV_CHANNELS.filter(channel => {
          const channelText = `${channel.name} ${channel.group || ''} ${channel.categories?.join(' ') || ''}`.toLowerCase();
          return horrorTerms.some(term => channelText.includes(term));
        });
        
        // Agregar todos los canales de respaldo si hay muy pocos canales
        if (allHorrorChannels.length < 3) {
          allHorrorChannels = [...allHorrorChannels, ...FALLBACK_IPTV_CHANNELS];
        } else {
          allHorrorChannels = [...allHorrorChannels, ...horrorFallbackChannels];
        }
        
        // Eliminar duplicados nuevamente
        allHorrorChannels = Array.from(
          new Map(allHorrorChannels.map(channel => [channel.url, channel])).values()
        );
      }
      
      // Limitar el número de canales
      return allHorrorChannels.slice(0, limit);
    }
    
    return horrorChannels;
  } catch (error) {
    console.error('Error al obtener canales de terror:', error);
    
    // En caso de error, devolver canales de respaldo
    console.log('Devolviendo canales de respaldo de terror debido a un error');
    return FALLBACK_IPTV_CHANNELS.slice(0, limit);
  }
};

/**
 * Obtiene todos los canales IPTV disponibles
 * @param limit Límite de canales a devolver (opcional, por defecto 50)
 * @returns Promise con array de canales IPTV
 */
export const fetchIPTVChannels = async (limit: number = 50): Promise<IPTVChannel[]> => {
  try {
    console.log('Obteniendo canales IPTV...');
    
    // Intentar obtener canales de las listas M3U8
    const fetchPromises = IPTV_PLAYLIST_URLS.slice(0, 3).map(url => fetchAndParseM3U8(url));
    const results = await Promise.allSettled(fetchPromises);
    
    // Combinar todos los canales de las listas
    let allChannels: IPTVChannel[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Lista ${index + 1}: Se obtuvieron ${result.value.length} canales`);
        allChannels = [...allChannels, ...result.value];
      } else {
        console.error(`Error al obtener canales de la lista ${index + 1}:`, result.reason);
      }
    });
    
    // Eliminar duplicados basados en URL
    const uniqueChannels = Array.from(
      new Map(allChannels.map(channel => [channel.url, channel])).values()
    );
    
    console.log(`Total de canales IPTV únicos: ${uniqueChannels.length}`);
    
    // Si no se encontraron canales o son muy pocos, usar los canales de respaldo
    if (uniqueChannels.length < 10) {
      console.log('Usando canales IPTV de respaldo...');
      return FALLBACK_IPTV_CHANNELS.slice(0, limit);
    }
    
    // Limitar el número de canales
    return uniqueChannels.slice(0, limit);
  } catch (error) {
    console.error('Error al obtener canales IPTV:', error);
    
    // En caso de error, devolver canales de respaldo
    console.log('Devolviendo canales IPTV de respaldo debido a un error');
    return FALLBACK_IPTV_CHANNELS.slice(0, limit);
  }
};

export default {
  parseM3U8,
  fetchAndParseM3U8,
  filterChannels,
  fetchMovieChannels,
  fetchHorrorChannels,
  fetchIPTVChannels
};
