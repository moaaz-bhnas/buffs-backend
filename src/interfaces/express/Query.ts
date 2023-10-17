export interface Query {
  select?: string;
  sort?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}
