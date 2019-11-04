export enum ExperimentStages {
    Select_Fetch = 'select-fetch',          // 1. Prepare Data
    Setup_Fetch = 'setup-fetch',            // |-->
    Select_Algorithm = 'select-algorithm',  // 2. Select Algorithm
    Setup_Algorithm = 'setup-algorithm',    // |-->
    Train_Algorithm = 'train-algorithm',    // 3. Train Algorithm
    Test_Algorithm = 'test-algorithm'       // 4. Test Algorithm
}
