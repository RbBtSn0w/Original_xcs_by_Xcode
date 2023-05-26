'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var XCSCouchPortNumber = 10355,
    XCSKonsoleLogLevels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

module.exports = {

    // Current API version
    XCSAPIVersion: 1,

    // Connection
    XCSUnitTestTTLInSeconds: 600, // 10 minutes
    XCSTTLInSeconds: 48 * 60 * 60, // 48 hours
    XCSAuthTokenTTLInSeconds: 60 * 5, // 5 minutes - used for OTA app installation
    XCSAPIBasePath: '/api',
    XCSProxiedAPIBasePath: '/xcode/api',
    XCSMaxSockets: 100,
    XCSCouchHost: '127.0.0.1',
    XCSCouchPort: XCSCouchPortNumber,
    XCSCouchDatabase: 'xcs',
    XCSCouchStats: '_stats',
    XCSHost: '127.0.0.1',
    XCSHTTPPort: 20300,
    XCSHTTPSPort: 20343,
    XCSSocketIOPort: 20399,
    XCSSecureClientAuthPort: 20344,
    XCSTurboSocketPort: 20345,
    XCSTurboSocketClientPort: 20346,
    XCSKonsoleHost: '',
    XCSKonsolePort: 9999,
    XCSCookieSessionTimeout: 24 * 60 * 60 * 1000,
    XCSPollForCommitInterval: 1,
    XCSMasterProcessPIDFilePath: '/Library/Developer/XcodeServer/Logs/xcsd.pid',
    XCSManageAllWorkersTimeout: 5000, // 5 seconds

    // Konsole log level
    XCSKonsoleLogLevels: XCSKonsoleLogLevels,
    XCSKonsoleLogLevel: XCSKonsoleLogLevels.info,
    XCSKonsoleDebugLogLevel: false,
    XCSKonsoleXCSDLogFilePath: '/Library/Developer/XcodeServer/Logs/xcsd.log',
    XCSKonsoleXCSDLogFileMaxSize: 10485760, //10MB per file max
    XCSKonsoleXCSDLogFileMaxFiles: 10, // Max number of files to rotate

    // Redis
    XCSRedisHost: '127.0.0.1',
    XCSRedisPort: 10356,
    XCSRedisReconnectDelay: 15 * 1000,
    XCSRedisQuietMode: false,
    XCSRedisHotPath: 'hotpath:',
    XCSRedisSessionPrefix: 'session:',
    XCSRedisAuthTokenPrefix: 'token:',

    // Security
    XCSSSLCyphers: 'ECDHE-RSA-AES128-SHA256:AES128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL:!EDH',
    XCSSessionSecretKey: 'secret:sessionUUID',
    XCSSSLCertificateValidityPeriod: 365 * 5, // days (5 years)
    XCSCASigningIdentityCommonName: 'Xcode Server Root Certificate Authority',

    // ACLs
    XCSAdministrator: 'xcsdebugadmin',
    XCSCanCreateBots: 'canCreateBots',
    XCSCanViewBots: 'canViewBots',
    XCSCanCreateHostedRepositories: 'canCreateHostedRepositories',
    XCSAccessAuthenticated: '*:authenticated',
    XCSAccessAnyone: '*',
    XCSACLStandardRefreshTimeout: 5 * 60 * 1000,
    XCSACLUnavailableNodesRefreshTimeout: 15 * 1000,
    XCSACLExpandedGroupsTTLInSeconds: 600, // 10 minutes

    // Keychain
    XCSKeychainTemplate: 'template',

    // Profiler
    XCSProfilerActive: false,

    // Build service
    XCSBuildServiceFingerprint: 'buildServiceFingerprint',

    // HTTP methods
    XCSHTTPPOST: 'POST',

    // Headers
    XCSContentType: 'Content-Type',
    XCSContentTypeJSON: 'application/json',

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

    // CouchDB bulk import endpoint
    XCSCouchBulkImportOptions: {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        port: XCSCouchPortNumber,
        path: '/xcs/_bulk_docs'
    },

    // Version document
    XCSDesignDocumentVersion: 'version',
    XCSDesignDocumentViewAllVersions: 'all-versions',

    // ACL document
    XCSDesignDocumentACL: 'acl',
    XCSDesignDocumentViewAllACLs: 'all-acls',

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

    // Integration document
    XCSDesignDocumentIntegration: 'integration',
    XCSDesignDocumentViewAllIntegrations: 'all-integrations',
    XCSDesignDocumentViewIntegrationsByStep: 'by-step',
    XCSDesignDocumentViewIntegrationsTestInfo: 'integration-test-info',
    XCSDesignDocumentViewIntegrationsByNumber: 'integrations-by-number',
    XCSDesignDocumentViewLastNonFatalIntegrationsByNumber: 'non-fatal-integrations-by-number',
    XCSDesignDocumentViewIntegrationsByBot: 'all-integrations-by-bot',
    XCSDesignDocumentViewLastIntegrationForBot: 'last-integration',
    XCSDesignDocumentViewLastNonFatalIntegrationForBot: 'last-non-fatal-integration',
    XCSDesignDocumentViewLastNonFatalIntegrationWithBuildResultSummaryForBot: 'last-non-fatal-integration-with-buildResultSummary',
    XCSDesignDocumentViewIntegrationsOrphaned: 'orphaned',
    XCSDesignDocumentViewAssetSizeByDate: 'asset-size-by-date',
    XCSDesignDocumentViewIntegrationsToPrune: 'integrations-to-prune',
    XCSDesignDocumentViewIntegrationsSubDocuments: 'integration-subdocuments',
    XCSDesignDocumentViewIntegrationSubDocUUID: 'integrationSubDocUUID',

    // Filter
    XCSDesignDocumentFilter: 'filter',
    XCSDesignDocumentViewFilterLastCompletedIntegration: 'last-completed-integration',
    XCSDesignDocumentViewFilterLastFailed: 'integration-last-failed',
    XCSDesignDocumentViewFilterLastSucceeded: 'integration-last-succeeded',
    XCSDesignDocumentViewFilterTag: 'integration-tag',

    // Issue document
    XCSDesignDocumentIssue: 'issue',
    XCSDesignDocumentViewAllIssues: 'all-issues',
    XCSDesignDocumentViewIssuesByIntegrationID: 'issues-by-integration_id',

    // Test document
    XCSDesignDocumentTest: 'test',
    XCSDesignDocumentViewTestsForIntegrationByDevice: 'tests-for-integration-by-device',

    // All document
    XCSDesignDocumentAll: 'all',
    XCSDesignDocumentViewAllUUIDs: 'all-UUIDs',
    XCSDesignDocumentPatch: 'patch',
    XCSDesignDocumentViewInPlace: 'inplace',

    // Settings
    XCSDesignDocumentSettings: 'settings',
    XCSDesignDocumentViewAllSettings: 'all-settings',
    XCSSettingsDefaultContent: {
        mail_transport: 'sendmail',
        mail_transport_options: {},
        max_percent_disk_usage: 0.5,
        prune_disk_percent: 0.05,
        service_enabled: true
    },

    // Notifications
    XCSEmitNotificationBotCreated: 'botCreated',
    XCSEmitNotificationBotUpdated: 'botUpdated',
    XCSEmitNotificationBotRemoved: 'botRemoved',
    XCSEmitNotificationDeviceCreated: 'deviceCreated',
    XCSEmitNotificationDeviceUpdated: 'deviceUpdated',
    XCSEmitNotificationDeviceRemoved: 'deviceRemoved',
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
    XCSIsBuildService: 'isBuildService',
    XCSIsListenerForPortalSyncRequests: 'isListenerForPortalSyncRequests',
    XCSIsListenerForRepositoryRequests: 'isListenerForRepositoryRequests',

    // Patch
    XCSSetProperties: 'set_props',
    XCSUnsetProperties: 'unset_props',
    XCSCurrentStep: 'currentStep',
    XCSResult: 'result',

    // Paths
    XCSIntegrationAssets: '/Library/Developer/XcodeServer/IntegrationAssets',
    XCSRepositoryKeychainPath: '/Library/Developer/XcodeServer/Keychains/Repositories.keychain',
    XCSRepositoryKeychainSharedSecretPath: '/Library/Developer/XcodeServer/SharedSecrets/RepositoryKeychainSharedSecret',
    XCSDKeychainPath: '/Library/Developer/XcodeServer/Keychains/xcsd.keychain',
    XCSDKeychainSharedSecretPath: '/Library/Developer/XcodeServer/SharedSecrets/XCSDKeychainSharedSecret',
    XCS_SSL_SERVER_KEY_PATH: '/Library/Developer/XcodeServer/Certificates/xcsd.key',
    XCS_SSL_SERVER_CERT_PATH: '/Library/Developer/XcodeServer/Certificates/xcsd.crt',
    XCS_SSL_CLIENT_CA_PATH: '/Library/Developer/XcodeServer/Certificates/ClientCertificateAuthority',
    XCS_SSL_CLIENT_CA_CERT_PATH: '/Library/Developer/XcodeServer/Certificates/ClientCertificateAuthority/ClientCertificateAuthority certificates.pem',
    XCS_SSL_SERVER_CA_PATH: '/Library/Developer/XcodeServer/Certificates/ServerCertificateAuthority',
    XCS_SSL_SERVER_CA_CERT_PATH: '/Library/Developer/XcodeServer/Certificates/ServerCertificateAuthority/ServerCertificateAuthority certificates.pem',
    XCS_SSL_SERVER_CERT_EMAIL: 'xcsd@xcs.apple.com',
    XCSOTAConfigurationProfilePath: '/Library/Developer/XcodeServer/ConfigurationProfiles/ota.mobileconfig',

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
    XCSIntegrationResultCanceled: 'canceled',
    XCSIntegrationResultInternalError: 'internal-error',

    // Tags
    XCSTags: 'tags',

    // Filters
    XCSNonFatal: 'non_fatal',
    XCSWithBuildResultSummary: 'with_build_results',
    XCSLatest: 'latest',
    XCSFailed: 'failed',
    XCSSucceeded: 'succeeded',
    XCSTag: 'tag',

    // Miscellaneous
    XCSAsteriskHeaderLength: 175
};