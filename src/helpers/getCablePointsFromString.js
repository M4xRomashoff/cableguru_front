function isFloat(n) {
  return n !== '' && !isNaN(n) && Math.round(n) !== n;
}
export function getCablePointsFromString(str) {
  const numArr = [];
  const strArr = str.split(' ');
  strArr.map((item) => {
    let [lat, lng] = item.split(',');
    let point = { lat: parseFloat(lat), lng: parseFloat(lng) };
    if (isFloat(point.lat) && isFloat(point.lng)) {
      numArr.push(point);
    }
  });
  return numArr;
}
export function getOnePointFromString(item) {
  let [lat, lng] = item.split(',');
  let point = [parseFloat(lat), parseFloat(lng)];

  return point;
}
