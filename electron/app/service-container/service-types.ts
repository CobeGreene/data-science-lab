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
    ShortcutServiceModel,
    // Session Service Models
    FetchServiceModel,
    TransformServiceModel,
    CreateTestReportServiceModel,
    CreateAlgorithmServiceModel,
    DatasetVisualServiceModel,
    AlgorithmVisualServiceModel,
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
    ShortcutDataService,
    // Core Services
    WebService,
    FileService,
    RecorderService,
}
