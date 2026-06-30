// alignToRoad.js

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Query OSRM for driving route. If OSRM snaps a point > 50m away
 * (e.g. unmapped forest road) or takes a massive detour, fall back
 * to raw coordinates for that segment to prevent erroneous road-snapping.
 *
 * latlngs: array of [lat, lon]
 * Returns: { coords: [[lat, lon], ...], distanceKm: number }
 */
export async function getHybridRoute(latlngs) {
  console.log('latlngs: ', latlngs);
  if (!latlngs || latlngs.length < 2) {
    return { coords: latlngs || [], distanceKm: 0.0 };
  }

  // Sample coordinates to keep it under OSRM's limits
  let queryLatlngs = latlngs;
  if (queryLatlngs.length > 80) {
    const step = Math.floor(queryLatlngs.length / 78);
    const sampled = [queryLatlngs[0]];
    for (let i = 1; i < queryLatlngs.length - 1; i += step) {
      sampled.push(queryLatlngs[i]);
    }
    sampled.push(queryLatlngs[queryLatlngs.length - 1]);
    queryLatlngs = sampled;
  }

  const finalCoords = [];
  let totalDistKm = 0.0;

  try {
    const coordsStr = queryLatlngs
      .map(([lat, lon]) => `${lon.toFixed(8)},${lat.toFixed(8)}`)
      .join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=false&geometries=geojson&steps=true`;
    console.log('url: ', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: { 'User-Agent': 'RNTripTracker/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('data: ', data);

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const legs = route.legs || [];
      const waypoints = data.waypoints || [];

      for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        const p1 = queryLatlngs[i];
        const p2 = queryLatlngs[i + 1];

        const w1 = waypoints[i].location; // [lon, lat]
        const w2 = waypoints[i + 1].location;

        const snap1Km = haversine(p1[0], p1[1], w1[1], w1[0]);
        const snap2Km = haversine(p2[0], p2[1], w2[1], w2[0]);

        const legDistKm = (leg.distance || 0.0) / 1000.0;
        const havDistKm = haversine(p1[0], p1[1], p2[0], p2[1]);

        const isPoorSnap =
          snap1Km > 0.05 ||
          snap2Km > 0.05 ||
          (legDistKm > havDistKm * 2.5 && havDistKm > 0.05);

        if (isPoorSnap) {
          // Fallback: exact raw connection for unmapped segment
          const last = finalCoords[finalCoords.length - 1];
          if (!last || last[0] !== p1[0] || last[1] !== p1[1]) {
            finalCoords.push([p1[0], p1[1]]);
          }
          finalCoords.push([p2[0], p2[1]]);
          totalDistKm += havDistKm;
        } else {
          // Valid road trace
          totalDistKm += legDistKm;
          for (const stepData of leg.steps || []) {
            const coords = stepData.geometry?.coordinates || [];
            for (const c of coords) {
              const latLon = [c[1], c[0]];
              const last = finalCoords[finalCoords.length - 1];
              if (!last || last[0] !== latLon[0] || last[1] !== latLon[1]) {
                finalCoords.push(latLon);
              }
            }
          }
        }
      }

      return { coords: finalCoords, distanceKm: totalDistKm };
    }
  } catch (e) {
    console.log('ERROR WHILE ALIGN: ', e, '@@', e.message);
    // fall through to complete fallback below
  }

  // Complete fallback if API fails entirely
  let fallbackDistanceKm = 0.0;
  for (let i = 0; i < latlngs.length - 1; i++) {
    fallbackDistanceKm += haversine(
      latlngs[i][0],
      latlngs[i][1],
      latlngs[i + 1][0],
      latlngs[i + 1][1],
    );
  }
  return { coords: latlngs, distanceKm: fallbackDistanceKm };
}
