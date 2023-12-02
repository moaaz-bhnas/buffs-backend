import { Query } from "@/interfaces/express/Query";
import structuredClone from "@ungap/structured-clone";

function removeReservedParams(query: Query): Query {
  // Fields to exclude
  const reservedParams = ["select", "sort", "page", "limit"];
  const queryCopy = structuredClone(query);
  reservedParams.forEach((param) => delete queryCopy[param]);
  return queryCopy;
}

function addDollarSignToOperators(query: Query): Query {
  let queryString = JSON.stringify(query);
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in|eq|ne)\b/g,
    (match) => "$" + match
  );
  const newQuery = JSON.parse(queryString);
  return newQuery;
}

function commaSeparatedStringsToArray(object: any) {
  const result = Object.assign({}, object);

  for (const key in result) {
    const value = result[key];
    if (typeof value === "string" && value.includes(",")) {
      result[key] = value.split(",");
    } else if (typeof value === "object") {
      result[key] = commaSeparatedStringsToArray(value);
    }
  }

  return result;
}

export default function getMongoDBFormattedQuery(query: Query) {
  let formattedQuery = structuredClone(query);

  // 1. convert comma-separated strings to array
  formattedQuery = commaSeparatedStringsToArray(formattedQuery);

  // 2. remove reserved words
  formattedQuery = removeReservedParams(formattedQuery);

  // 3. create operators (e.g. $lt, $gt)
  formattedQuery = addDollarSignToOperators(formattedQuery);

  return formattedQuery;
}
