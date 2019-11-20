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

    // Transform Plugins
    export const GetAllTransformPluginsEvent = 'get-all-transform-plugins-event';
    export const GetAllTransformPluginsListeners = 'get-all-transform-plugins-listeners';

    // Fetch Plugins
    export const GetAllFetchPluginsEvent = 'get-all-fetch-plugins-event';
    export const GetAllFetchPluginsListeners = 'get-all-fetch-plugins-listeners';
    
    // Data Groups
    export const GetAllDataGroupsEvent = 'get-all-data-groups-event';
    export const GetAllDataGroupsListeners = 'get-all-data-groups-listeners';
    export const NewDataGroupListeners = 'new-data-group-listeners';
    export const DeleteDataGroupEvent = 'delete-data-group-event';
    export const DeleteDataGroupListeners = 'delete-data-group-listeners';
    export const UpdatedDataGroupListeners = 'updated-data-group-listeners';
    
}
