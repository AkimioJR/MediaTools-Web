export interface LogDetail {
  level: "trace" | "debug" | "info" | "warning" | "error";
  message: string;
  time: string;
  caller: string;
}
