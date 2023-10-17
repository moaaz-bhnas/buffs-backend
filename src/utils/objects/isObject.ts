export default function isObject(data: any): Boolean {
  return data && data.constructor === Object;
}
