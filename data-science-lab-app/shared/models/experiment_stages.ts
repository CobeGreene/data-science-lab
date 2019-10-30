export enum ExperimentStages {
    Select_Fetch,       // 1. Prepare Data
    Setup_Fetch,        // |-->
    Select_Algorithm,   // 2. Select Algorithm
    Setup_Algorithm,    // |-->
    Train_Algorithm,    // 3. Train Algorithm
    Test_Algorithm      // 4. Test Algorithm
}
