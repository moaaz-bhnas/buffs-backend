export interface ISeeder {
  seed(): Promise<void>;
  unseed(): Promise<void>;
}
