import type { TFileTypes } from '../types'

import path from 'path'

/**
 * Builds the paths from the two different variations
 * Local mounting uses the Uppers case version that comes from ENVs
 * VNC uses the lower case version because it comes from a config
 * Lowercase version overrides uppercase
 * This ensures a vnc repo can be loaded, or fallback to ENVs
 */
const normalizePaths = paths => {
  const {
    unitDir,
    workDir,
    stepsDir,
    supportDir,
    reportsDir,
    featuresDir,
    waypointDir,
    artifactsDir,
    environmentsDir,
    GOBLET_UNIT_DIR,
    GOBLET_WORK_DIR,
    GOBLET_STEPS_DIR,
    GOBLET_SUPPORT_DIR,
    GOBLET_REPORTS_DIR,
    GOBLET_FEATURES_DIR,
    GOBLET_WAYPOINT_DIR,
    GOBLET_ARTIFACTS_DIR,
    GOBLET_ENVIRONMENTS_DIR
  } = paths

  return {
    workDir: workDir || GOBLET_WORK_DIR,
    unitDir: unitDir || GOBLET_UNIT_DIR || `unit`,
    stepsDir: stepsDir || GOBLET_STEPS_DIR || `bdd/steps`,
    supportDir: supportDir || GOBLET_SUPPORT_DIR || `bdd/support`,
    featuresDir: featuresDir || GOBLET_FEATURES_DIR || `bdd/features`,
    waypointDir: waypointDir || GOBLET_WAYPOINT_DIR || `waypoints`,
    artifactsDir: artifactsDir || GOBLET_ARTIFACTS_DIR || `artifacts`,
    reportsDir: reportsDir || GOBLET_REPORTS_DIR || `artifacts/reports`,
    environmentsDir: environmentsDir || GOBLET_ENVIRONMENTS_DIR || `environments`,
  }
}

/**
 * Builds the test types allowed when working with goblet
 * @param {string} repoRoot - Location to the tests directory
 * @param {Object} pathEnvs - Locations test directories within the repoRoot
 *
 * @returns {Object} - Built allowed file types object
 */
export const getFileTypes = (
  repoRoot:string,
  paths:Record<string, string>
) => {
  const locations = normalizePaths(paths)
  const baseDir = locations.workDir
    ? path.join(repoRoot, locations.workDir)
    : repoRoot

  return {
    artifact: {
      ext: `*`,
      type: `artifact`,
      location: path.join(baseDir, locations.artifactsDir),
    },
    feature: {
      ext: `feature`,
      type: `feature`,
      location: path.join(baseDir, locations.featuresDir),
    },
    json: {
      ext: `json`,
      type: `json`,
      location: baseDir,
    },
    env: {
      ext: `env`,
      type: `env`,
      location: path.join(baseDir, locations.environmentsDir),
    },
    report: {
      ext: `html`,
      type: `report`,
      location: path.join(baseDir, locations.reportsDir),
    },
    support: {
      ext: `js`,
      type: `support`,
      location: path.join(baseDir, locations.supportDir),
    },
    definition: {
      ext: `js`,
      type: `definition`,
      location: path.join(baseDir, locations.stepsDir),
    },
    unit: {
      ext: `js`,
      type: `unit`,
      typeInName: true,
      location: path.join(baseDir, locations.unitDir),
    },
    waypoint: {
      ext: `js`,
      type: `waypoint`,
      typeInName: true,
      location: path.join(baseDir, locations.waypointDir),
    },
  } as TFileTypes
}

