const cache=new Map();
async function fetchJson(url){const response=await fetch(url,{signal:AbortSignal.timeout(7000)});if(!response.ok)throw new Error('WEATHER_UNAVAILABLE');return response.json();}
export async function weatherForLocation(location){
 const key=location.toLowerCase().trim(),cached=cache.get(key);if(cached&&cached.until>Date.now())return cached.value;
 const geo=await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`),place=geo.results?.[0];
 if(!place||!Number.isFinite(place.latitude)||!Number.isFinite(place.longitude))throw new Error('LOCATION_NOT_FOUND');
 const data=await fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,precipitation&daily=temperature_2m_mean,precipitation_sum&forecast_days=7&timezone=auto`);
 if(!data.current||typeof data.current.time!=='string'||!Number.isFinite(data.current.temperature_2m)||!Array.isArray(data.daily?.time))throw new Error('WEATHER_UNAVAILABLE');
 const value={location:{name:place.name,country:place.country,latitude:place.latitude,longitude:place.longitude},current:{temperatureC:data.current.temperature_2m,precipitationMm:Number.isFinite(data.current.precipitation)?data.current.precipitation:null,time:data.current.time,timezone:data.timezone},forecast:{days:data.daily.time.map((date,i)=>({date,meanTemperatureC:Number.isFinite(data.daily.temperature_2m_mean?.[i])?data.daily.temperature_2m_mean[i]:null,precipitationMm:Number.isFinite(data.daily.precipitation_sum?.[i])?data.daily.precipitation_sum[i]:null}))},source:'Open-Meteo forecast models',retrievedAt:new Date().toISOString(),note:'Current model conditions and 7-day forecast; not a station observation, seasonal rainfall or historical climate.'};
 cache.set(key,{value,until:Date.now()+15*60*1000});if(cache.size>500)cache.delete(cache.keys().next().value);return value;
}
