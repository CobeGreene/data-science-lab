import { FetchPluginDataConverter } from './fetch-plugin-data.converter';
import { FetchPluginData } from 'data-science-lab-core';
import { ExperimentDataGroup, ExperimentFeature } from '../../models';

export class AppFetchPluginDataConverter implements FetchPluginDataConverter {

    constructor() {

    }

    NameGenerator = class {
        constructor(public prefix: string, public start: number) {

        }
        next(): string {
            return `${this.prefix} ${this.start++}`;
        }
    };

    toDataGroups(data: FetchPluginData): ExperimentDataGroup[] {

        const features: ExperimentFeature[] = [];
        
        const nameGen = new this.NameGenerator('Feature', 1);
        
        // Converting row major to column major
        for (const row of data.examples) {
            for (let column = 0; column < row.length; ++column) {
                
                if (features.length <= column) {
                    features.push(new ExperimentFeature());
                    if (data.features.length > column) {
                        features[column].name = data.features[column];
                    } else {
                        features[column].name = nameGen.next();
                    }
                }
                features[column].examples.push(row[column]);
            }
        }
        
        // Determine types of features.
        for (const feature of features) {
            feature.type = this.getType(feature.examples[0]);
        }
        
        // Partition features into same sizes
        const partitions = this.partition(features);
        
        // Convert partiton to data groups
        const groups: ExperimentDataGroup[] = [];
        
        for (const partition of partitions) {
            const dataGroup = new ExperimentDataGroup({
                label: 'new data group',
            });
            for (const feature of partition) {
                dataGroup.add(feature);
            }
            groups.push(dataGroup);
        }

        return groups;
    }

    getType(data: any): string {
        if (data instanceof Array) {
            return `${this.getType(data[0])}[]`;
        }
        return typeof data;
    }

    partition(features: ExperimentFeature[]): ExperimentFeature[][] {
        const partitions: ExperimentFeature[][] = [];

        for (const feature of features) {
            let bestFit = 0;
            while (bestFit < partitions.length) {
                if (partitions[bestFit][0].examples.length === feature.examples.length) {
                    break;
                }
                ++bestFit;
            }

            if (bestFit < partitions.length) {
                partitions[bestFit].push(feature);
            } else {
                partitions.push([feature]);
            }
        }

        return partitions;
    }

}
