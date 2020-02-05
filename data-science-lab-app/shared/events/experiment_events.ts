export namespace ExperimentsEvents {
    // Experiment
    export const CreateEvent = 'create-experiment';
    export const CreateListeners = 'create-experiment-listeners';
    export const GetAllEvent = 'get-all-experiments';
    export const GetAllListeners = 'get-all-experiments-listeners';
    export const UpdatedListeners = 'updated-experiment-listeners';

    // Fetch Session
    export const GetAllFetchSessionsEvent = 'get-all-fetch-sessions-event';
    export const GetAllFetchSessionsListeners = 'get-all-fetch-sessions-listener';
    export const CreateFetchSessionEvent = 'create-fetch-session-event';
    export const CreateFetchSessionListeners = 'create-fetch-session-listeners';
    export const DeleteFetchSessionEvent = 'delete-fetch-session-event';
    export const DeleteFetchSessionListeners = 'delete-fetch-session-listeners';
    export const SubmitOptionsFetchSessionEvent = 'submit-options-fetch-session-event';
    export const ExecuteCommandFetchSessionEvent = 'execute-command-fetch-session-event';
    export const UpdatedFetchSessionListeners = 'updated-fetch-session-listeners';
    export const FinishedFetchSessionListeners = 'finished-fetch-session-listeners';

    // Transform Session
    export const GetAllTransformSessionsEvent = 'get-all-transform-sessions-event';
    export const GetAllTransformSessionsListeners = 'get-all-transform-sessions-listener';
    export const CreateTransformSessionEvent = 'create-transform-session-event';
    export const CreateTransformSessionListeners = 'create-transform-session-listeners';
    export const DeleteTransformSessionEvent = 'delete-transform-session-event';
    export const DeleteTransformSessionListeners = 'delete-transform-session-listeners';
    export const SubmitOptionsTransformSessionEvent = 'submit-options-transform-session-event';
    export const ExecuteCommandTransformSessionEvent = 'execute-command-transform-session-event';
    export const UpdatedTransformSessionListeners = 'updated-transform-session-listeners';
    export const FinishedTransformSessionListeners = 'finished-transform-session-listeners';
    
    // Visualization Algorithm Session
    export const GetAllVisualizationAlgorithmSessionsEvent = 'get-all-visualization-algorithm-sessions-event';
    export const GetAllVisualizationAlgorithmSessionsListeners = 'get-all-visualization-algorithm-sessions-listener';
    export const CreateVisualizationAlgorithmSessionEvent = 'create-visualization-algorithm-session-event';
    export const CreateVisualizationAlgorithmSessionListeners = 'create-visualization-algorithm-session-listeners';
    export const DeleteVisualizationAlgorithmSessionEvent = 'delete-visualization-algorithm-session-event';
    export const DeleteVisualizationAlgorithmSessionListeners = 'delete-visualization-algorithm-session-listeners';
    export const SubmitOptionsVisualizationAlgorithmSessionEvent = 'submit-options-visualization-algorithm-session-event';
    export const ExecuteCommandVisualizationAlgorithmSessionEvent = 'execute-command-visualization-algorithm-session-event';
    export const UpdatedVisualizationAlgorithmSessionListeners = 'updated-visualization-algorithm-session-listeners';
    export const FinishedVisualizationAlgorithmSessionListeners = 'finished-visualization-algorithm-session-listeners';
    
    // Visualization Data Session
    export const GetAllVisualizationDataSessionsEvent = 'get-all-visualization-data-sessions-event';
    export const GetAllVisualizationDataSessionsListeners = 'get-all-visualization-data-sessions-listener';
    export const CreateVisualizationDataSessionEvent = 'create-visualization-data-session-event';
    export const CreateVisualizationDataSessionListeners = 'create-visualization-data-session-listeners';
    export const DeleteVisualizationDataSessionEvent = 'delete-visualization-data-session-event';
    export const DeleteVisualizationDataSessionListeners = 'delete-visualization-data-session-listeners';
    export const SubmitOptionsVisualizationDataSessionEvent = 'submit-options-visualization-data-session-event';
    export const ExecuteCommandVisualizationDataSessionEvent = 'execute-command-visualization-data-session-event';
    export const UpdatedVisualizationDataSessionListeners = 'updated-visualization-data-session-listeners';
    export const FinishedVisualizationDataSessionListeners = 'finished-visualization-data-listeners';
    
    // Algorithm Testing Session
    export const GetAllAlgorithmTestingSessionsEvent = 'get-all-algorithm-testing-sessions-event';
    export const GetAllAlgorithmTestingSessionsListeners = 'get-all-algorithm-testing-sessions-listener';
    export const RequestAlgorithmTestingSessionEvent = 'request-algorithm-testing-session-event';
    export const NewAlgorithmTestingSessionListener = 'new-algorithm-testing-session-listener';
    export const StartAlgorithmTestingSessionEvent = 'start-algorithm-testing-session-event';
    export const FinishedAlgorithmTestingSessionListener = 'finished-algorithm-testing-session-listener';

    // Algorithm Session
    export const GetAllAlgorithmSessionsEvent = 'get-all-algorithm-sessions-event';
    export const GetAllAlgorithmSessionsListeners = 'get-all-algorithm-sessions-listener';
    export const CreateAlgorithmSessionEvent = 'create-algorithm-session-event';
    export const CreateAlgorithmSessionListeners = 'create-algorithm-session-listeners';
    export const DeleteAlgorithmSessionEvent = 'delete-algorithm-session-event';
    export const DeleteAlgorithmSessionListeners = 'delete-algorithm-session-listeners';
    export const SubmitOptionsAlgorithmSessionEvent = 'submit-options-algorithm-session-event';
    export const ExecuteCommandAlgorithmSessionEvent = 'execute-command-algorithm-session-event';
    export const UpdatedAlgorithmSessionListeners = 'updated-algorithm-session-listeners';
    export const FinishedAlgorithmSessionListeners = 'finished-algorithm-session-listeners';

    // Transform Plugins
    export const GetAllTransformPluginsEvent = 'get-all-transform-plugins-event';
    export const GetAllTransformPluginsListeners = 'get-all-transform-plugins-listeners';

    // Visualization Plugins
    export const GetAllVisualizationPluginsEvent = 'get-all-visualization-plugins-event';
    export const GetAllVisualizationPluginsListeners = 'get-all-visualization-plugins-listeners';

    // Fetch Plugins
    export const GetAllFetchPluginsEvent = 'get-all-fetch-plugins-event';
    export const GetAllFetchPluginsListeners = 'get-all-fetch-plugins-listeners';
    
    // Algorithm Plugins
    export const GetAllAlgorithmPluginsEvent = 'get-all-algorithm-plugins-event';
    export const GetAllAlgorithmPluginsListeners = 'get-all-algorithm-plugins-listeners';

    // Data Groups
    export const GetAllDataGroupsEvent = 'get-all-data-groups-event';
    export const GetAllDataGroupsListeners = 'get-all-data-groups-listeners';
    export const NewDataGroupListeners = 'new-data-group-listeners';
    export const DeleteDataGroupEvent = 'delete-data-group-event';
    export const DeleteDataGroupListeners = 'delete-data-group-listeners';
    export const UpdatedDataGroupListeners = 'updated-data-group-listeners';

    // Test Report
    export const GetAllTestReportEvent = 'get-all-test-report-event';
    export const GetAllTestReportListeners = 'get-all-test-report-listeners';
    export const NewTestReportListeners = 'new-test-report-listeners';

    // Visualizations
    export const GetAllVisualizationsEvent = 'get-all-visualizations-event';
    export const GetAllVisualizationsListeners = 'get-all-visualizations-listeners';
    export const NewVisualizationsListeners = 'new-visualization-listeners';
    export const DeleteVisualizationsEvent = 'delete-visualization-event';
    export const DeleteVisualizationsListeners = 'delete-visualization-listeners';
    export const UpdatedVisualizationsListeners = 'updated-visualization-listeners';
    
    // Algorithm
    export const GetAllAlgorithmsEvent = 'get-all-algorithms-event';
    export const GetAllAlgorithmsListeners = 'get-all-algorithms-listeners';
    export const NewAlgorithmListeners = 'new-algorithm-listeners';
    export const DeleteAlgorithmEvent = 'delete-algorithm-event';
    export const DeleteAlgorithmListeners = 'delete-algorithm-listeners';
    export const UpdatedAlgorithmListeners = 'updated-algorithm-listeners';
    export const StartAlgorithmEvent = 'start-algorithm-event';
    export const StopAlgorithmEvent = 'stop-algorithm-event';

    // Tracker
    export const NewAlgorithmTrackerListeners = 'new-algorithm-tracker-listeners';
    export const UpdatedAlgorithmTrackerListeners = 'updated-algorithm-tracker-listeners';
}
