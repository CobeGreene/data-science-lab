export enum ExperimentStages {
    Select_Fetch = 'select_fetch',          // 1. Prepare Data
    Setup_Fetch = 'setup_fetch',            // |-->
    Select_Algorithm = 'select_algorithm',  // 2. Select Algorithm
    Setup_Algorithm = 'setup_algorithm',    // |-->
    Train_Algorithm = 'train_algorithm',    // 3. Train Algorithm
    Test_Algorithm = 'test_algorithm'       // 4. Test Algorithm
}
