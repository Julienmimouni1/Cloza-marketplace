export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
