

export const passTest = {
  cycle: [
    `player.start`,
    `feature.start`,
    `scenario.start`,
    `step1.start`,
    `step1.end`,
    `step2.start`,
    `step2.end`,
    `step3.start`,
    `step3.end`,
    `scenario.end`,
    `feature.end`,
    `player.end`,
  ],
  player: {
    start: {
      message: 'Playing started',
      name: 'PLAY-STARTED',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature',
      data: {}
    },
    end: {
      name: 'PLAY-ENDED',
      message: 'Playing stopped',
      isPlaying: false,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature',
      data: {}
    }
  },
  feature: {
    start: {
      data: {
        id: 'suite-0',
        action: 'start',
        testPath: '/suite-0',
        fullName: 'Feature > Visit the Goblog',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'Feature > Visit the Goblog',
        timestamp: 1673446967434
      },
      message: 'Player - Suite Start',
      name: 'PLAY-SUITE-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'suite-0',
        action: 'end',
        testPath: '/suite-0',
        fullName: 'Feature > Visit the Goblog',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'Feature > Visit the Goblog',
        timestamp: 1673446967434,
        describes: [],
        tests: []
      },
      message: 'Player - Suite Done',
      name: 'PLAY-SUITE-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  example: {
    start: {
      data: {
        id: 'suite-0-0',
        action: 'start',
        testPath: '/suite-0-0',
        fullName: 'Scenario > Visit the Goblog page',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'Scenario > Visit the Goblog page',
        timestamp: 1673446967435
      },
      message: 'Player - Suite Start',
      name: 'PLAY-SUITE-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'suite-0-0',
        action: 'end',
        testPath: '/suite-0-0',
        fullName: 'Scenario > Visit the Goblog page',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'Scenario > Visit the Goblog page',
        timestamp: 1673446967435,
        tests: []
      },
      message: 'Player - Suite Done',
      name: 'PLAY-SUITE-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  step1: {
    start: {
      data: {
        id: 'spec0',
        action: 'start',
        testPath: '/suite-0-0/spec0',
        fullName: 'Scenario > Visit the Goblog page > Given I navigate to "https://www.gobletqa.com/"',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'Given I navigate to "https://www.gobletqa.com/"',
        timestamp: 1673446967435
      },
      message: 'Player - Spec Start',
      name: 'PLAY-SPEC-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'spec0',
        action: 'end',
        testPath: '/suite-0-0/spec0',
        fullName: 'Scenario > Visit the Goblog page > Given I navigate to "https://www.gobletqa.com/"',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'Given I navigate to "https://www.gobletqa.com/"',
        timestamp: 1673446968326,
        status: 'passed'
      },
      message: 'Player - Spec Done',
      name: 'PLAY-SPEC-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
  },
  step2: {
    start: {
      data: {
        id: 'spec1',
        action: 'start',
        testPath: '/suite-0-0/spec1',
        fullName: 'Scenario > Visit the Goblog page > And I wait for the page to load',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'And I wait for the page to load',
        timestamp: 1673446968327
      },
      message: 'Player - Spec Start',
      name: 'PLAY-SPEC-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'spec1',
        action: 'end',
        testPath: '/suite-0-0/spec1',
        fullName: 'Scenario > Visit the Goblog page > And I wait for the page to load',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'And I wait for the page to load',
        timestamp: 1673446968328,
        status: 'passed'
      },
      message: 'Player - Spec Done',
      name: 'PLAY-SPEC-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  step3: {
    start: {
      data: {
        id: 'spec2',
        action: 'start',
        testPath: '/suite-0-0/spec2',
        fullName: `Scenario > Visit the Goblog page > And I click "nav a[href='https://www.gobletqa.com/blog']"`,
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: `And I click "nav a[href='https://www.gobletqa.com/blog']"`,
        timestamp: 1673446968328
      },
      message: 'Player - Spec Start',
      name: 'PLAY-SPEC-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'spec2',
        action: 'end',
        testPath: '/suite-0-0/spec2',
        fullName: `Scenario > Visit the Goblog page > And I click "nav a[href='https://www.gobletqa.com/blog']"`,
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: `And I click "nav a[href='https://www.gobletqa.com/blog']"`,
        timestamp: 1673446968938,
        status: 'passed'
      },
      message: 'Player - Spec Done',
      name: 'PLAY-SPEC-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  }
}


export const failTest = {
  cycle: [
    `player.start`,
    `feature.start`,
    `scenario.start`,
    `step1.start`,
    `step1.end`,
    `step2.start`,
    `step2.end`,
    `step3.start`,
    `step3.end`,
    `error`,
    `player.end`,
  ],
  player: {
    start: {
      message: 'Playing started',
      name: 'PLAY-STARTED',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature',
      data: {}
    },
    end: {
      name: 'PLAY-ENDED',
      message: 'Playing stopped',
      isPlaying: false,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature',
      data: {}
    }
  },
  feature: {
    start: {
      data: {
        id: 'suite-0',
        action: 'start',
        testPath: '/suite-0',
        fullName: 'Feature > Visit the Goblog',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'Feature > Visit the Goblog',
        timestamp: 1673446967434
      },
      message: 'Player - Suite Start',
      name: 'PLAY-SUITE-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'suite-0',
        action: 'end',
        testPath: '/suite-0',
        fullName: 'Feature > Visit the Goblog',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'Feature > Visit the Goblog',
        timestamp: 1673446967434,
        describes: [],
        tests: []
      },
      message: 'Player - Suite Done',
      name: 'PLAY-SUITE-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  example: {
    start: {
      data: {
        id: 'suite-0-0',
        action: 'start',
        testPath: '/suite-0-0',
        fullName: 'Scenario > Visit the Goblog page',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'Scenario > Visit the Goblog page',
        timestamp: 1673446967435
      },
      message: 'Player - Suite Start',
      name: 'PLAY-SUITE-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'suite-0-0',
        action: 'end',
        testPath: '/suite-0-0',
        fullName: 'Scenario > Visit the Goblog page',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'Scenario > Visit the Goblog page',
        timestamp: 1673446967435,
        tests: []
      },
      message: 'Player - Suite Done',
      name: 'PLAY-SUITE-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  step1: {
    start: {
      data: {
        id: 'spec0',
        action: 'start',
        testPath: '/suite-0-0/spec0',
        fullName: 'Scenario > Visit the Goblog page > Given I navigate to "https://www.gobletqa.com/"',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'Given I navigate to "https://www.gobletqa.com/"',
        timestamp: 1673446967435
      },
      message: 'Player - Spec Start',
      name: 'PLAY-SPEC-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'spec0',
        action: 'end',
        testPath: '/suite-0-0/spec0',
        fullName: 'Scenario > Visit the Goblog page > Given I navigate to "https://www.gobletqa.com/"',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'Given I navigate to "https://www.gobletqa.com/"',
        timestamp: 1673446968326,
        status: 'passed'
      },
      message: 'Player - Spec Done',
      name: 'PLAY-SPEC-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
  },
  step2: {
    start: {
      data: {
        id: 'spec1',
        action: 'start',
        testPath: '/suite-0-0/spec1',
        fullName: 'Scenario > Visit the Goblog page > And I wait for the page to load',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'And I wait for the page to load',
        timestamp: 1673446968327
      },
      message: 'Player - Spec Start',
      name: 'PLAY-SPEC-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'spec1',
        action: 'end',
        testPath: '/suite-0-0/spec1',
        fullName: 'Scenario > Visit the Goblog page > And I wait for the page to load',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: true,
        description: 'And I wait for the page to load',
        timestamp: 1673446968328,
        status: 'passed'
      },
      message: 'Player - Spec Done',
      name: 'PLAY-SPEC-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  step3: {
    start: {
      data: {
        id: 'spec2',
        action: 'start',
        testPath: '/suite-0-0/spec2',
        fullName: 'Scenario > Visit the Goblog page > And I click "#super-duper"',
        type: 'test',
        failedExpectations: [],
        passedExpectations: [],
        failed: false,
        passed: false,
        description: 'And I click "#super-duper"',
        timestamp: 1673447541333
      },
      message: 'Player - Spec Start',
      name: 'PLAY-SPEC-START',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    },
    end: {
      data: {
        id: 'spec2',
        action: 'end',
        testPath: '/suite-0-0/spec2',
        fullName: 'Scenario > Visit the Goblog page > And I click "#super-duper"',
        type: 'test',
        failedExpectations: [ [Object] ],
        passedExpectations: [],
        failed: true,
        passed: false,
        description: 'And I click "#super-duper"',
        timestamp: 1673447571384,
        status: 'failed'
      },
      message: 'Player - Spec Done',
      name: 'PLAY-SPEC-DONE',
      isPlaying: true,
      location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
      fileType: 'feature'
    }
  },
  error: {
    message: 'locator.waitFor: Timeout 30000ms exceeded.\n' +
      '=========================== logs ===========================\n' +
      'waiting for selector "#super-duper" to be visible\n' +
      '============================================================',
    name: 'PLAY-ERROR',
    isPlaying: true,
    location: '/goblet/repos/lancetipton/goblet/bdd/features/visit-goblog.feature',
    fileType: 'feature',
    data: {}
  }
}