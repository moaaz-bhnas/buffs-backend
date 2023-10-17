export default function isArray(data: any): Boolean {
  return data && data.constructor === Array;
}
