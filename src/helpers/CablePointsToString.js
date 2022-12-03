export default function convertToString(points) {
  let text = '';
  let subItem = '';
  points.map((item) => {
    subItem = item.lat.toString() + ',' + item.lng.toString() + ' ';
    text = text + subItem;
  });
  return text;
}
