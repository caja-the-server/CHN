export type ValueObjectVerifyResult<Data> =
  | { success: true; data: Data }
  | { success: false; message: string };
