import {
  artifactSaveOption,
  shouldSaveArtifact,
  artifactSaveActive,
} from '../artifactSaveOption'

describe('Artifact Save Option', () => {
  it('should return false when option is undefined', () => {
    expect(artifactSaveOption(undefined)).toBe(false)
  })

  it('should return false when option is "never"', () => {
    expect(artifactSaveOption('never')).toBe(false)
  })

  it('should return "always" when option is "always"', () => {
    expect(artifactSaveOption('always')).toBe('always')
  })

  it('should return "failed" when option is "failed"', () => {
    expect(artifactSaveOption('failed')).toBe('failed')
  })

  it('should return false when option is boolean false', () => {
    expect(artifactSaveOption(false)).toBe(false)
  })

  it('should return false when option is boolean true', () => {
    expect(artifactSaveOption(true)).toBe(false)
  })
})

describe('Should Save Artifact', () => {
  it('should return false when option is undefined', () => {
    expect(shouldSaveArtifact(undefined, 'passed')).toBe(false)
  })

  it('should return false when option is "never"', () => {
    expect(shouldSaveArtifact('never', 'passed')).toBe(false)
  })

  it('should return true when option is "always" and test status is "passed"', () => {
    expect(shouldSaveArtifact('always', 'passed')).toBe(true)
  })

  it('should return true when option is "failed" and test status is "failed"', () => {
    expect(shouldSaveArtifact('failed', 'failed')).toBe(true)
  })

  it('should return false when option is "failed" and test status is "passed"', () => {
    expect(shouldSaveArtifact('failed', 'passed')).toBe(false)
  })

  it('should return false when option is boolean false and test status is "passed"', () => {
    expect(shouldSaveArtifact(false, 'passed')).toBe(false)
  })

  it('should return false when option is boolean true and test status is "passed"', () => {
    expect(shouldSaveArtifact(true, 'passed')).toBe(false)
  })
})

describe('Artifact Save Active', () => {
  it('should return false when option is undefined', () => {
    expect(artifactSaveActive(undefined)).toBe(false)
  })

  it('should return false when option is "never"', () => {
    expect(artifactSaveActive('never')).toBe(false)
  })

  it('should return true when option is "always"', () => {
    expect(artifactSaveActive('always')).toBe(true)
  })

  it('should return true when option is "failed"', () => {
    expect(artifactSaveActive('failed')).toBe(true)
  })

  it('should return false when option is boolean false', () => {
    expect(artifactSaveActive(false)).toBe(false)
  })

  it('should return false when option is boolean true', () => {
    expect(artifactSaveActive(true)).toBe(false)
  })
})
