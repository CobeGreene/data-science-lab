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

    // Fetch Plugins
    export const GetAllFetchPluginsEvent = 'get-all-fetch-plugins-event';
    export const GetAllFetchPluginsListeners = 'get-all-fetch-plugins-listeners';
    
    
}
