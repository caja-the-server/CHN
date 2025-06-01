export const NODE_ENV: "development" | "production" =
  process.env.NODE_ENV === "production" ? "production" : "development";
