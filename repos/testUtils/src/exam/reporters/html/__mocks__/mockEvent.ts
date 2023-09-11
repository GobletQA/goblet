 import type {
  TExamEvt,
  TExEventData,
} from "@gobletqa/exam"

export const mockEvent = {
  name: 'PLAY-RESULTS',
  message: 'Exam - Suite Results',
  data: {
    id: 'root',
    action: 'end',
    testPath: '/root',
    fullName: 'root',
    type: 'root',
    failedExpectations: [],
    passedExpectations: [],
    failed: true,
    passed: false,
    description: 'Test execution complete',
    timestamp: 1693361889035,
    describes: [
      {
        id: 'suite-0',
        action: 'end',
        testPath: '/suite-0',
        fullName: 'Feature > 01. View My Apps',
        type: 'describe',
        failedExpectations: [],
        passedExpectations: [],
        failed: true,
        passed: false,
        description: 'Feature > 01. View My Apps',
        timestamp: 1693361890073,
        metaData: {
          disabled: false,
          index: 2,
          uuid: 'feature-2122698476',
          tags: {
            index: 1,
            tokens: [ '@whitelist' ],
            content: '@whitelist',
            type: 'tags',
            uuid: 'tags-351513591',
            whitespace: ''
          },
          feature: '01. View My Apps',
          type: 'feature'
        },
        describes: [
          {
            id: 'suite-0-0',
            action: 'end',
            testPath: '/suite-0-0',
            fullName: 'Scenario > Steps',
            type: 'describe',
            failedExpectations: [],
            passedExpectations: [],
            failed: true,
            passed: false,
            description: 'Scenario > Steps',
            timestamp: 1693361890075,
            metaData: {
              disabled: false,
              index: 5,
              uuid: 'feature-2122698476.scenario.0',
              tags: {
                index: 4,
                tokens: [ '@goblet-simple-steps' ],
                content: '@goblet-simple-steps',
                type: 'tags',
                uuid: 'tags-2117646448',
                whitespace: '  '
              },
              type: 'scenario',
              scenario: 'Steps'
            },
            tests: [
              {
                id: 'spec-0',
                action: 'test',
                testPath: '/suite-0-0/spec-0',
                fullName: 'Scenario > Steps > Given I sign into useverb.com',
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: true,
                description: 'Given I sign into useverb.com',
                timestamp: 1693361898549,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.given.0',
                  step: 'I sign into useverb.com',
                  index: 6,
                  type: 'given'
                },
                status: 'passed'
              },
              {
                id: 'spec-1',
                action: 'test',
                testPath: '/suite-0-0/spec-1',
                fullName: "Scenario > Steps > When I wait for element '$$rightNav.seekerDash' to be 'visible'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: true,
                description: "When I wait for element '$$rightNav.seekerDash' to be 'visible'",
                timestamp: 1693361898569,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.1',
                  step: "I wait for element '$$rightNav.seekerDash' to be 'visible'",
                  index: 7,
                  type: 'when'
                },
                status: 'passed'
              },
              {
                id: 'spec-2',
                action: 'test',
                testPath: '/suite-0-0/spec-2',
                fullName: "Scenario > Steps > When I click '$$rightNav.seekerDash'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [
                  {
                    locator: `Locator@.JobseekerIcon.rightNavIcon >> nth=0`
                  }
                ],
                failed: false,
                passed: true,
                description: "When I click '$$rightNav.seekerDash'",
                timestamp: 1693361898862,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.2',
                  step: "I click '$$rightNav.seekerDash'",
                  index: 8,
                  type: 'when'
                },
                status: 'passed'
              },
              {
                id: 'spec-3',
                action: 'test',
                testPath: '/suite-0-0/spec-3',
                fullName: 'Scenario > Steps > When I wait 5 second(s)',
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: true,
                description: 'When I wait 5 second(s)',
                timestamp: 1693361903870,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.3',
                  step: 'I wait 5 second(s)',
                  index: 9,
                  type: 'when'
                },
                status: 'passed'
              },
              {
                id: 'spec-4',
                action: 'test',
                testPath: '/suite-0-0/spec-4',
                fullName: "Scenario > Steps > When I click '#JobseekerHeader .ApplicationButton'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [
                  {
                    locator: `Locator@#JobseekerHeader .ApplicationButton >> nth=0`
                  }
                ],
                failed: false,
                passed: true,
                description: "When I click '#JobseekerHeader .ApplicationButton'",
                timestamp: 1693361904067,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.4',
                  step: "I click '#JobseekerHeader .ApplicationButton'",
                  index: 10,
                  type: 'when'
                },
                status: 'passed'
              },
              {
                id: 'spec-5',
                action: 'test',
                testPath: '/suite-0-0/spec-5',
                fullName: `Scenario > Steps > When I click 'internal:role=button[name="Apply on Web"i]'`,
                type: 'test',
                failedExpectations: [],
                passedExpectations: [
                  {
                    locator: `Locator@internal:role=button[name="Apply on Web"i] >> nth=0`
                  }
                ],
                failed: false,
                passed: true,
                description: `When I click 'internal:role=button[name="Apply on Web"i]'`,
                timestamp: 1693361904620,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.5',
                  step: `I click 'internal:role=button[name="Apply on Web"i]'`,
                  index: 11,
                  type: 'when'
                },
                status: 'passed'
              },
              {
                id: 'spec-6',
                action: 'test',
                testPath: '/suite-0-0/spec-6',
                fullName: "Scenario > Steps > Then the element '.video-container' style 'display' is 'flex'",
                type: 'test',
                failedExpectations: [
                  {
                    error: `locator.evaluate: Timeout 30000ms exceeded.
                    =========================== logs ===========================
                    waiting for locator('.video-container')
                    ============================================================`,
                    result: undefined,
                    name: 'TimeoutError',
                    fullName: "Scenario > Steps > Then the element '.video-container' style 'display' is 'flex'",
                    description: 'locator.evaluate: Timeout 30000ms exceeded.\n' +
                      '=========================== logs ===========================\n' +
                      "waiting for locator('.video-container')\n" +
                      '============================================================',
                    status: 'failed'
                  }
                ],
                passedExpectations: [],
                failed: true,
                passed: false,
                description: "Then the element '.video-container' style 'display' is 'flex'",
                timestamp: 1693361934642,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.then.6',
                  step: "the element '.video-container' style 'display' is 'flex'",
                  index: 12,
                  type: 'then'
                },
                status: 'failed'
              },
              {
                id: 'spec-7',
                action: 'skipped',
                testPath: '/suite-0-0/spec-7',
                fullName: "Scenario > Steps > When I type 'Testarosa' into '.positionTitleInput'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "When I type 'Testarosa' into '.positionTitleInput'",
                timestamp: 1693361934643,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.7',
                  step: "I type 'Testarosa' into '.positionTitleInput'",
                  index: 13,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-8',
                action: 'skipped',
                testPath: '/suite-0-0/spec-8',
                fullName: "Scenario > Steps > When I click '.next-button'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "When I click '.next-button'",
                timestamp: 1693361934643,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.8',
                  step: "I click '.next-button'",
                  index: 14,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-9',
                action: 'skipped',
                testPath: '/suite-0-0/spec-9',
                fullName: "Scenario > Steps > Then '.save-profile-changes' contains 'Create application'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "Then '.save-profile-changes' contains 'Create application'",
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.then.9',
                  step: "'.save-profile-changes' contains 'Create application'",
                  index: 15,
                  type: 'then'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-10',
                action: 'skipped',
                testPath: '/suite-0-0/spec-10',
                fullName: 'Scenario > Steps > When I wait 6 second(s)',
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: 'When I wait 6 second(s)',
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.10',
                  step: 'I wait 6 second(s)',
                  index: 16,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-11',
                action: 'skipped',
                testPath: '/suite-0-0/spec-11',
                fullName: "Scenario > Steps > When I click '.save-changes.confirm'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "When I click '.save-changes.confirm'",
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.11',
                  step: "I click '.save-changes.confirm'",
                  index: 17,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-12',
                action: 'skipped',
                testPath: '/suite-0-0/spec-12',
                fullName: 'Scenario > Steps > When I wait 3 second(s)',
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: 'When I wait 3 second(s)',
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.12',
                  step: 'I wait 3 second(s)',
                  index: 18,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-13',
                action: 'skipped',
                testPath: '/suite-0-0/spec-13',
                fullName: "Scenario > Steps > Then I click '$$popUps.pushNoThanks' if it exists",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "Then I click '$$popUps.pushNoThanks' if it exists",
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.then.13',
                  step: "I click '$$popUps.pushNoThanks' if it exists",
                  index: 19,
                  type: 'then'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-14',
                action: 'skipped',
                testPath: '/suite-0-0/spec-14',
                fullName: "Scenario > Steps > When I click '.web-buttons .confirm-sub-button'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "When I click '.web-buttons .confirm-sub-button'",
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.14',
                  step: "I click '.web-buttons .confirm-sub-button'",
                  index: 20,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-15',
                action: 'skipped',
                testPath: '/suite-0-0/spec-15',
                fullName: 'Scenario > Steps > When I wait 10 second(s)',
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: 'When I wait 10 second(s)',
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.15',
                  step: 'I wait 10 second(s)',
                  index: 21,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-16',
                action: 'skipped',
                testPath: '/suite-0-0/spec-16',
                fullName: `Scenario > Steps > When I click 'internal:role=heading[name="Testarosa"i]'`,
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: `When I click 'internal:role=heading[name="Testarosa"i]'`,
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.16',
                  step: `I click 'internal:role=heading[name="Testarosa"i]'`,
                  index: 22,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-17',
                action: 'skipped',
                testPath: '/suite-0-0/spec-17',
                fullName: "Scenario > Steps > When I click '.web-buttons .confirm-sub-button'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "When I click '.web-buttons .confirm-sub-button'",
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.17',
                  step: "I click '.web-buttons .confirm-sub-button'",
                  index: 23,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-18',
                action: 'skipped',
                testPath: '/suite-0-0/spec-18',
                fullName: `Scenario > Steps > When I click '.ThreeDotsDropdown:right-of(:text("Testarosa"))'`,
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: `When I click '.ThreeDotsDropdown:right-of(:text("Testarosa"))'`,
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.18',
                  step: `I click '.ThreeDotsDropdown:right-of(:text("Testarosa"))'`,
                  index: 24,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-19',
                action: 'skipped',
                testPath: '/suite-0-0/spec-19',
                fullName: `Scenario > Steps > When I click '#threeDots .dropdown-wrapper .copy-option:has-text("Withdraw Application")'`,
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: `When I click '#threeDots .dropdown-wrapper .copy-option:has-text("Withdraw Application")'`,
                timestamp: 1693361934644,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.19',
                  step: `I click '#threeDots .dropdown-wrapper .copy-option:has-text("Withdraw Application")'`,
                  index: 25,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              },
              {
                id: 'spec-20',
                action: 'skipped',
                testPath: '/suite-0-0/spec-20',
                fullName: "Scenario > Steps > When I click '.Dialog .confirm-button'",
                type: 'test',
                failedExpectations: [],
                passedExpectations: [],
                failed: false,
                passed: false,
                description: "When I click '.Dialog .confirm-button'",
                timestamp: 1693361934645,
                metaData: {
                  disabled: false,
                  uuid: 'feature-2122698476.scenario.0.when.20',
                  step: "I click '.Dialog .confirm-button'",
                  index: 26,
                  type: 'when'
                },
                skipped: true,
                status: 'skipped'
              }
            ],
            status: 'failed'
          }
        ],
        status: 'failed'
      }
    ],
    status: 'failed',
    location: '/github/workspace/goblet/bdd/features/Seeker/Create-App/01--View-My-Apps.feature'
  }
} as unknown as TExamEvt<TExEventData>
