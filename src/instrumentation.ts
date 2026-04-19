export async function register() {
  if (process.env.NODE_ENV === "development") {
    const { STRATEGY_REGISTRY } = await import("./lib/timer-strategies");
    const { run_dev_validation } = await import("./lib/timer-registry-validator");
    const path = await import("path");

    const app_dir = path.join(process.cwd(), "src", "app");

    try {
      await run_dev_validation(Object.keys(STRATEGY_REGISTRY), app_dir);
    } catch (err) {
      console.error(err);
    }
  }
}
