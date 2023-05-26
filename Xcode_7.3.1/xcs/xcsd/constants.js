'use strict';

var XCSKonsoleLogLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

module.exports = {

    // Current API version
    XCSAPIVersion: 10,
    XCSLatestClientVersion: 5,

    // Connection
    XCSUnitTestTTLInSeconds: 600, // 10 minutes
    XCSTTLInSeconds: 48 * 60 * 60, // 48 hours
    XCSAuthTokenTTLInSeconds: 60 * 5, // 5 minutes - used for OTA app installation
    XCSAPIBasePath: '/api',
    XCSProxiedAPIBasePath: '/xcode/api',
    XCSCouchStats: '_stats',
    XCSKonsoleHost: '',
    XCSKonsolePort: 9999,
    XCSCookieSessionTimeout: 24 * 60 * 60 * 1000,
    XCSPollForCommitInterval: 1,
    XCSManageAllWorkersTimeout: 5000, // 5 seconds

    // Express Connect Debug
    XCSDebugConnectSession: false,

    // Xcode Server configuration
    XCSXcodeFrameworksPath: '/Library/Developer/XcodeServer/CurrentXcodeSymlink/Contents/SharedFrameworks',
    XCSConfigurationFilePath: '/Library/Developer/XcodeServer/Configuration/xcs.conf',

    // Konsole log level
    XCSKonsoleLogLevels: XCSKonsoleLogLevels,
    XCSKonsoleLogLevel: XCSKonsoleLogLevels.info,
    XCSKonsoleDebugLogLevel: false,
    XCSKonsoleXCSDLogFilePath: '/Library/Developer/XcodeServer/Logs/xcsd.log',

    // Headers
    XCSUserAgent: 'user-agent',
    XCSContentType: 'Content-Type',
    XCSContentTypeJSON: 'application/json',

    // Redis
    XCSRedisReconnectDelay: 1 * 1000,
    XCSRedisFirstConnectDelay: 1 * 1000,
    XCSRedisQuietMode: false,
    XCSRedisHotPath: 'hotpath:',
    XCSRedisSessionPrefix: 'session:',
    XCSRedisAuthTokenPrefix: 'token:',
    XCSRedisWorkerSetupPhase: 'worker-setup-phase',
    XCSRedisServiceInitPhase: 'service-init-phase',
    XCSRedisServiceInitPhaseManual: 'service-init-phase-manual',
    XCSRedisMaintenanceTasksPhase: 'maintenanceTasksPhase',
    XCSRedisMaintenanceTasksResults: 'maintenanceTasksResults',
    XCSRedisSpecifiedNumOfCPUs: 'specifiedNumOfCPUs',

    // Security
    XCSSSLCyphers: 'ECDHE-RSA-AES128-SHA256:AES128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL:!EDH',
    XCSSSLCertificateValidityPeriod: 365 * 5, // days (5 years)
    XCSCASigningIdentityCommonName: 'Xcode Server Root Certificate Authority',

    // ACLs
    XCSAdministrator: 'xcsdebugadmin',
    XCSCanCreateBots: 'canCreateBots',
    XCSCanViewBots: 'canViewBots',
    XCSCanCreateHostedRepositories: 'canCreateHostedRepositories',
    XCSAccessAuthenticated: '*:authenticated',
    XCSAccessAnyone: '*',
    XCSACLStandardRefreshTimeout: 5,
    XCSACLUnavailableNodesRefreshTimeout: 15 * 1000,

    // Keychain
    XCSKeychainTemplate: 'template',

    // Profiler
    XCSProfilerActive: true,

    // Build service
    XCSBuildServiceFingerprint: 'buildServiceFingerprint',

    // Custom headers
    XCSServerAPIVersionHeader: 'X-XCSAPIVersion',
    XCSClientVersion: 'x-xcsclientversion',
    XCSUnitTestHeader: 'x-xcsunittest',
    XCSUnitTestNameHeader: 'x-xcsunittestname',
    XCSPayloadSizeHeader: 'x-xcspayloadsize',
    XCSUnitTestProperty: 'xcsunittest',
    XCSRequestUUID: 'x-xcsrequestuuid',
    XCSForceLogin: 'x-xcsforcelogin',
    XCSResultsList: 'X-XCSResultsList',
    XCSHostHeader: 'host',
    XCSForwardedHost: 'x-forwarded-host',
    XCSForwardedProto: 'x_forwarded_proto',
    XCSResponseStatus: 'x-xcsresponsestatus',
    XCSResponseStatusTitle: 'X-XCSResponse-Status-Title',
    XCSResponseLocation: 'Location',

    // Request watcher
    RequestWatcherTimeout: 10000,
    XCSRequestWatcher: 'XCSRequestWatcher',

    // MemWatch
    XCSMemWatchActive: 'XCSMemWatchActive',
    XCSMemWatchMethod: 'XCSMemWatchMethod',
    XCSMemWatchURL: 'XCSMemWatchURL',

    // Reindexation watcher
    ReindexationWatcherInterval: 5 * 60 * 1000,

    // Expired documents watcher
    ExpiredDocumentsWatcherInterval: 60 * 60 * 1000,

    // Pruning
    XCSMinNumberOfIntegrationsSafeFromPruning: 10,

    // Dashboard
    XCSDashboard: 'XCSDashboard',
    XCSDashboardInited: 'XCSDashboardInited',
    XCSStatusEvent: 'xcsStatusEvent',
    XCSLastError: 'lastError',
    XCSHealth: 'xcsHealth',
    XCSStatus503: 'status503',

    // MemWatch documents
    XCSDesignDocumentMemWatchStats: 'mw_stats',
    XCSDesignDocumentMemWatchLeak: 'mw_leak',
    XCSDesignDocumentMemWatchDiff: 'mw_diff',

    // Version document
    XCSDesignDocumentVersion: 'version',
    XCSDesignDocumentViewAllVersions: 'all-versions',

    // ACL document
    XCSDesignDocumentACL: 'acl',
    XCSDesignDocumentViewAllACLs: 'all-acls',

    // Agent document
    XCSDesignDocumentAgent: 'agent',
    XCSDesignDocumentViewAgentsByFingerprint: 'agents-by-fingerprint',

    // Bot document
    XCSDesignDocumentBot: 'bot',
    XCSDesignDocumentViewAllBots: 'all-bots',
    XCSDesignDocumentViewSuccessStreak: 'success-streak',
    XCSDesignDocumentViewLastCleanIntegration: 'last-clean-integration',
    XCSDesignDocumentViewIntegrationsPerDay: 'integrations-per-day',
    XCSDesignDocumentViewAverageIntegrationTime: 'avg-integration-time',
    XCSDesignDocumentViewTestAdditionRate: 'test-addition-rate',
    XCSDesignDocumentViewAnalysisWarningStats: 'analysis_warning_stats',
    XCSDesignDocumentViewTestFailureStats: 'test_failure_stats',
    XCSDesignDocumentViewErrorStats: 'error_stats',
    XCSDesignDocumentViewRegressedPerfTestStats: 'regressed_perf_test_stats',
    XCSDesignDocumentViewWarningStats: 'warning_stats',
    XCSDesignDocumentViewImprovedPerfTestStats: 'improved_perf_test_stats',
    XCSDesignDocumentViewTestsStats: 'tests_stats',
    XCSDesignDocumentViewIntegrationCountPerBot: 'integration_count-per-bot',
    XCSBotScheduleType: {
        periodic: {
            value: 1,
            name: 'periodic'
        },
        onCommit: {
            value: 2,
            name: 'onCommit'
        },
        manual: {
            value: 3,
            name: 'manual'
        }
    },

    // Commit document
    XCSDesignDocumentCommit: 'commit',
    XCSDesignDocumentViewAllCommits: 'all-commits',
    XCSDesignDocumentViewCommitsByIntegrationID: 'commits-by-integration_id',
    XCSDesignDocumentViewCommitsPerDay: 'commits-per-day',
    XCSDesignDocumentUnitTest: 'unit_test',
    XCSDesignDocumentViewAllUnitTests: 'all-unit_tests',

    // Device document
    XCSDesignDocumentDevice: 'device',
    XCSDesignDocumentViewAllDevices: 'all-devices',
    XCSDesignDocumentViewThisDevice: 'this-device',

    XCSDesignDocumentPlatform: 'platform',
    XCSDesignDocumentViewAllPlatforms: 'all-platforms',
    XCSDesignDocumentViewPlatformsByIdentifier: 'platforms-by-identifier',

    XCSDesignDocumentToolchain: 'toolchain',
    XCSDesignDocumentViewAllToolchains: 'all-toolchains',
    XCSDesignDocumentViewToolchainsByIdentifier: 'toolchains-by-identifier',

    // Integration document
    XCSDesignDocumentIntegration: 'integration',
    XCSDesignDocumentViewIntegrationsByStep: 'by-step',
    XCSDesignDocumentViewIntegrationsRunning: 'integrations-running',
    XCSDesignDocumentViewIntegrationsTestInfo: 'integration-test-info',
    XCSDesignDocumentViewIntegrationsByNumber: 'integrations-by-number',
    XCSDesignDocumentViewLastNonFatalIntegrationsByNumber: 'non-fatal-integrations-by-number',
    XCSDesignDocumentViewIntegrationsByBot: 'all-integrations-by-bot',
    XCSDesignDocumentViewNonPrunedIntegrationsByBot: 'all-non-pruned-integrations-by-bot',
    XCSDesignDocumentViewLastIntegrationForBot: 'last-integration',
    XCSDesignDocumentViewLastNonFatalIntegrationForBot: 'last-non-fatal-integration',
    XCSDesignDocumentViewLastNonFatalIntegrationWithBuildResultSummaryForBot: 'last-non-fatal-integration-with-buildResultSummary',
    XCSDesignDocumentViewIntegrationsOrphaned: 'orphaned',
    XCSDesignDocumentViewAssetSizeByDate: 'asset-size-by-date',
    XCSDesignDocumentViewIntegrationsToPrune: 'integrations-to-prune',
    XCSDesignDocumentViewIntegrationsSubDocuments: 'integration-subdocuments',
    XCSDesignDocumentViewIntegrationSubDocUUID: 'integrationSubDocUUID',
    XCSDesignDocumentViewIntegrationNumberPerDay: 'integration-number-per-day',
    XCSDesignDocumentViewIntegrationHasCoverageData: 'hasCoverageData',
    XCSDesignDocumentViewIntegrationQueue: 'integration-queue',

    // File document
    XCSDesignDocumentFile: 'file',
    XCSDesignDocumentViewFilesByIntegrationAndType: 'files-by-integration-and-type',
    XCSDesignDocumentViewFilesByPath: 'files-by-path',
    XCSDesignDocumentViewProductsByVariant: 'products-by-variant',

    // Filter
    XCSDesignDocumentFilter: 'filter',
    XCSDesignDocumentViewFilterLastCompletedIntegration: 'last-completed-integration',
    XCSDesignDocumentViewFilterLastFailed: 'integration-last-failed',
    XCSDesignDocumentViewFilterLastSucceeded: 'integration-last-succeeded',
    XCSDesignDocumentViewFilterTag: 'integration-tag',

    // Issue document
    XCSIssueHashVersion: 1,
    XCSDesignDocumentIssue: 'issue',
    XCSDesignDocumentViewAllIssues: 'all-issues',
    XCSDesignDocumentViewIssuesByIntegrationID: 'issues-by-integration_id',
    XCSDesignDocumentViewBotIssuesByHash: 'bot-issues-by-hash',
    XCSDesignDocumentViewBotIssuesByIntegration: 'bot-issues-by-integration',
    XCSDesignDocumentViewOpenBotIssuesByBot: 'open-bot-issues-by-bot',

    // Test document
    XCSDesignDocumentTest: 'test',
    XCSDesignDocumentViewTestsForIntegrationByDevice: 'tests-for-integration-by-device',

    // All document
    XCSDesignDocumentAll: 'all',
    XCSDesignDocumentViewAllUUIDs: 'all-UUIDs',
    XCSDesignDocumentViewAllByType: 'all-byType',
    XCSDesignDocumentViewAllByExpirationTime: 'all-by-expiration-time',

    // Settings
    XCSDesignDocumentSettings: 'settings',
    XCSDesignDocumentViewAllSettings: 'all-settings',
    XCSServiceEnabledKey: 'service_enabled',
    XCSServiceDisabledOnInitKey: 'service-disabled-on-init',
    XCSSettingsDefaultContent: {
        mail_transport: 'sendmail',
        mail_transport_options: {},
        max_percent_disk_usage: 0.75,
        service_enabled: true
    },

    // Code Coverage
    XCSDesignDocumentCodeCoverage: 'code_coverage',
    XCSDesignDocumentViewCCMasterDoc: 'all-ccim',
    XCSDesignDocumentViewCCFiles: 'all-ccif',
    XCSCodeCoverageTargetsKey: 'trg',
    XCSCodeCoverageKeyPathKey: 'kph',
    XCSCodeCoverageFilesKey: 'fls',
    XCSCodeCoverageMethodsKey: 'mth',
    XCSCodeCoverageDevicesKey: 'dvcs',
    XCSCodeCoverageTitleKey: 'tte',
    XCSCodeCoverageIntegrationIDKey: 'integrationID',
    XCSCodeCoverageIntegrationNumberKey: 'integrationNumber',
    XCSCodeCoverageLinePercentageKey: 'lnp',
    XCSCodeCoverageLinePercentageDeltaKey: 'lnpd',
    XCSDesignDocumentCodeCoverageIntegrationMaster: 'ccim',
    XCSDesignDocumentCodeCoverageIntegrationFile: 'ccif',

    // Notifications
    XCSEmitNotificationBotCreated: 'botCreated',
    XCSEmitNotificationBotUpdated: 'botUpdated',
    XCSEmitNotificationBotRemoved: 'botRemoved',
    XCSEmitNotificationDeviceCreated: 'deviceCreated',
    XCSEmitNotificationDeviceUpdated: 'deviceUpdated',
    XCSEmitNotificationDeviceRemoved: 'deviceRemoved',
    XCSEmitNotificationToolchainCreated: 'toolchainCreated',
    XCSEmitNotificationToolchainRemoved: 'toolchainRemoved',
    XCSEmitNotificationACLUpdated: 'aclUpdated',
    XCSEmitNotificationPendingIntegrations: 'pendingIntegrations',
    XCSEmitNotificationNotificationIntegrationCreated: 'integrationCreated',
    XCSEmitNotificationNotificationStatus: 'integrationStatus',
    XCSEmitNotificationNotificationCancelIntegration: 'cancelIntegration',
    XCSEmitNotificationNotificationIntegrationRemoved: 'integrationRemoved',
    XCSEmitNotificationNotificationRequestPortalSync: 'requestPortalSync',
    XCSEmitNotificationListRepositories: 'listRepositories',
    XCSEmitNotificationCreateRepository: 'createRepository',
    XCSEmitNotificationNotificationAdvisoryIntegrationStatus: 'advisoryIntegrationStatus',
    XCSEmitNotificationNotificationPing: 'ping',
    XCSEmitNotificationNotificationPong: 'pong',

    // Socket
    XCSSocketOnAuthenticate: 'authenticate',
    XCSSocketOnRequestAdvisoryIntegrationStatus: 'advisoryIntegrationStatus',
    XCSSocketOnRequestAdvisoryPingPong: 'pingpong',
    XCSSocketOnRequestAdvisoryPing: 'ping',
    XCSSocketOnRequestAdvisoryPingAll: 'pingAll',
    XCSSocketOnRequestAdvisoryPingAdmins: 'pingAdmins',

    // Socket filters
    XCSIsListener: 'isListener',
    XCSIsAdminListener: 'isAdminListener',
    XCSIsListenerForIntegrationUpdates: 'isListenerForIntegrationUpdates',
    XCSIsListenerForIntegrationCancels: 'isListenerForIntegrationCancels',
    XCSIsListenerForACLUpdates: 'isListenerForACLUpdates',
    XCSIsListenerForBotUpdates: 'isListenerForBotUpdates',
    XCSIsListenerForDeviceUpdates: 'isListenerForDeviceUpdates',
    XCSIsListenerForToolchainUpdates: 'isListenerForToolchainUpdates',
    XCSIsBuildService: 'isBuildService',
    XCSIsListenerForPortalSyncRequests: 'isListenerForPortalSyncRequests',
    XCSIsListenerForRepositoryRequests: 'isListenerForRepositoryRequests',

    // Patch
    XCSFirstVersionWithoutSetProps: 4,
    XCSSetProperties: 'set_props',
    XCSCurrentStep: 'currentStep',
    XCSResult: 'result',

    // Integration step types
    XCSIntegrationStepTypePending: 'pending',
    XCSIntegrationStepTypePreparing: 'preparing',
    XCSIntegrationStepTypeCheckout: 'checkout',
    XCSIntegrationStepTypeTriggers: 'triggers',
    XCSIntegrationStepTypeBuilding: 'building',
    XCSIntegrationStepTypeProcessing: 'processing',
    XCSIntegrationStepTypeUploading: 'uploading',
    XCSIntegrationStepTypeCompleted: 'completed',

    // Integration results
    XCSIntegrationResultSucceeded: 'succeeded',
    XCSIntegrationResultBuildErrors: 'build-errors',
    XCSIntegrationResultTestFailures: 'test-failures',
    XCSIntegrationResultWarnings: 'warnings',
    XCSIntegrationResultAnalyzerWarnings: 'analyzer-warnings',
    XCSIntegrationResultCanceled: 'canceled',
    XCSIntegrationResultInternalError: 'internal-error',

    // Tags
    XCSTags: 'tags',

    // KeyPath
    XCSKeyPaths: 'keyPaths',

    // Filters
    XCSNonFatal: 'non_fatal',
    XCSWithBuildResultSummary: 'with_build_results',
    XCSLatest: 'latest',
    XCSFailed: 'failed',
    XCSSucceeded: 'succeeded',
    XCSTag: 'tag',
    XCSSummaryOnly: 'summary_only',

    // Delegation
    XCSDelegationOnce: 'delegation:',
    XCSDelegationOnceSocketIOTraffic: 'socketioTraffic',

    // Task return codes
    XCSReturnCodeSuccess: 0,
    XCSReturnCodeIncorrectUsage: 1,
    XCSReturnCodeUnknownError: 2,
    XCSReturnCodeBadRequest: 3,
    XCSReturnCodeUnauthorized: 4,
    XCSReturnCodeInternalError: 5,
    XCSReturnCodeServiceUnavailable: 6,

    // Miscellaneous
    XCSAsteriskHeaderLength: 175,
    XCSTinyIDLength: 7,
    XCSActiveTask: 'XCSActiveTask:',
    XCSServerNotRunning: 'not running',
    XCSUnitTestRedisCachePrefix: 'utrc:',
    XCSUnitTestRedisCached: 'X-XCSUnitTestRedisCached',
    XCSUnitTestRedisCachedTTLInSeconds: 120, // 2 minutes
    XCSIntegrationsLimit: 100
};