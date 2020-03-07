export const enum SERVICE_TYPES {
    Placeholder,
    // Ipc Services
    IpcService,
    // Producer
    Producer,
    // Context
    SettingsContext,
    OriginalPluginContext,
    PluginContext,
    // Converters
    PluginDataConverter,
    // Service Models
    ExperimentServiceModel,
    PackageServiceModel,
    ThemeServiceModel,
    OpenLinkServiceModel,
    UserSettingServiceModel,
    DatasetServiceModel,
    SessionPluginServiceModel,
    AlgorithmServiceModel,
    TrackerServiceModel,
    VisualServiceModel,
    TestReportServiceModel,
    // Session Service Models
    FetchServiceModel,
    TransformServiceModel,
    CreateTestReportServiceModel,
    CreateAlgorithmServiceModel,
    DatasetVisualServiceModel,
    // Data Services
    ExperimentDataService,
    ThemeDataService,
    UserSettingDataService,
    PackageDataService,
    SessionDataService,
    DatasetDataService,
    SessionPluginDataService,
    AlgorithmDataService,
    TrackerDataService,
    TestReportDataService,
    VisualDataService,
    TestReportSessionDataService,
    // Core Services
    WebService,
    FileService,
    RecorderService,
}
