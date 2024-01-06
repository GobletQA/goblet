const config = {
  $ref: 'GobletQA/testify-mock',
  recorder: {
    locator: "-- 🍷 GOBLET"
  },
  paths: {
    repoRoot: __dirname,
    workDir: "goblet",
    artifactsDir: "artifacts",
    environmentsDir: "environments",
    reportsDir: "artifacts/reports",
    featuresDir: "bdd/features",
    supportDir: "bdd/support",
    stepsDir: "bdd/steps",
    unitDir: "unit",
    waypointDir: "waypoint",
    world: "world.json"
  }
}

export default config
