export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await import("./env");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
