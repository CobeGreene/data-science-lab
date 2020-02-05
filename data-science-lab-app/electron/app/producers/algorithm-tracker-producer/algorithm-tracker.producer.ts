import { Producer } from '../producer';
import { AlgorithmTracker } from '../../models';

export interface AlgorithmTrackerProducer extends Producer {

    newTracker(tracker: AlgorithmTracker): void;
    updateTracker(tracker: AlgorithmTracker): void;
}
