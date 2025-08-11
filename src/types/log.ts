export interface LogDetail {
  level: "info" | "warn" | "error";
  message: string;
  time: string;
  caller: string;
}
