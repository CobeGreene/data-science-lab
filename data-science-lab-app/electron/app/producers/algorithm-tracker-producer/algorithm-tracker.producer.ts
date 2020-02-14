import { Producer } from '../producer';
import { AlgorithmTracker } from '../../models';

export interface AlgorithmTrackerProducer extends Producer {

    all(trackers: AlgorithmTracker[]): void;
    newTracker(tracker: AlgorithmTracker): void;
    updateTracker(tracker: AlgorithmTracker): void;
}
