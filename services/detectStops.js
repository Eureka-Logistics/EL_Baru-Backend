function detectLongStops(data, minDurationHours = 3) {
  const result = [];
  let group = [];

  const parseDateTime = (str) => new Date(str.replace(' ', 'T') + 'Z');

  for (let i = 0; i < data.length; i++) {
    const current = data[i];

    if (!current || typeof current.datetime !== 'string' || typeof current.speed !== 'number') {
      continue;
    }

    if (current.speed === 0) {
      group.push(current);
    } else {
      result.push(...checkGroup(group, parseDateTime, minDurationHours));
      group = [];
    }
  }

  result.push(...checkGroup(group, parseDateTime, minDurationHours));
  return result;
}

function checkGroup(group, parseDateTime, minDurationHours) {
  if (group.length < 2) return [];

  const start = parseDateTime(group[0].datetime);
  const end = parseDateTime(group[group.length - 1].datetime);
  const diffHours = (end - start) / (1000 * 60 * 60);

  if (diffHours >= minDurationHours) {
    return [{
      from: group[0].datetime,
      to: group[group.length - 1].datetime,
      duration_hours: diffHours.toFixed(2),
      latitude: group[0].latitude,
      longitude: group[0].longitude,
      geoName: group[0].geoName || 'Unknown'
    }];
  }
  return [];
}

module.exports = { detectLongStops };
