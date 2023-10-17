import { Query } from "@/interfaces/express/Query";
import structuredClone from "@ungap/structured-clone";

export default class QueryFormatter {
  private static removeReservedParams(query: Query): Query {
    // Fields to exclude
    const reservedParams = ["select", "sort", "page", "limit"];
    const queryCopy = structuredClone(query);
    reservedParams.forEach((param) => delete queryCopy[param]);
    return queryCopy;
  }

  private static addDollarSignToOperators(query: Query): Query {
    let queryString = JSON.stringify(query);
    queryString = queryString.replace(
      /\b(lt|lte|gt|gte|in)\b/g,
      (match) => "$" + match
    );
    const newQuery = JSON.parse(queryString);
    return newQuery;
  }

  public static getMongoDBFormattedQuery(query: Query) {
    let formattedQuery = structuredClone(query);
    formattedQuery = this.removeReservedParams(formattedQuery);
    formattedQuery = this.addDollarSignToOperators(formattedQuery);
    return formattedQuery;
  }
}
