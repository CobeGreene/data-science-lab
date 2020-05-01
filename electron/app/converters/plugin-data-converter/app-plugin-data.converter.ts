import { PluginDataConverter } from './plugin-data.converter';
import { PluginData } from 'data-science-lab-core';
import { DatasetObject, FeatureObject } from '../../models';
import { getType } from '../../helpers';

export class AppPluginDataConverter implements PluginDataConverter {

    constructor() {

    }

    NameGenerator = class {
        constructor(public prefix: string, public start: number) {

        }
        next(): string {
            return `${this.prefix} ${this.start++}`;
        }
    };

    convert(data: PluginData): DatasetObject[] {

        const features: FeatureObject[] = [];
        
        const nameGen = new this.NameGenerator('Feature', 1);
        
        // Converting row major to column major
        for (const row of data.examples) {
            for (let column = 0; column < row.length; ++column) {
                if (features.length <= column) {
                    features.push({
                        name: (data.features.length > column) ? data.features[column] : nameGen.next(),
                        examples: [row[column]],
                        type: getType(row[column])
                    });
                } else {
                    features[column].examples.push(row[column]);
                }
            }
        }
        
        // Determine types of features.
        for (const feature of features) {
            feature.type = getType(feature.examples[0]);
        }
        
        // Partition features into same sizes
        const partitions = this.partition(features);
        
        // Convert partiton to dataset groups
        const groups: DatasetObject[] = [];
        
        for (const partition of partitions) {
            const dataset: DatasetObject = {
                id: 0,
                name: 'New Dataset',
                examples: partition[0].examples.length,
                experimentId: 0,
                features: partition,
            };
            groups.push(dataset);
        }

        return groups;
    }

    partition(features: FeatureObject[]): FeatureObject[][] {
        const partitions: FeatureObject[][] = [];

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
