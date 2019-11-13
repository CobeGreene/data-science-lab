import { DataGroupConverter } from './data-group.converter';
import { ExperimentDataGroup, DataGroupSettings } from '../../models';
import { DataGroupViewModel } from '../../../../shared/view-models';


export class AppDataGroupConverter implements DataGroupConverter {
    
    toViewModel(dataGroup: ExperimentDataGroup, settings: DataGroupSettings): DataGroupViewModel {
        const previewFeatures = dataGroup.features.map(value => value.name).slice(0, settings.numOfFeatures);
        const previewFeatureTypes = dataGroup.features.map(value => value.type).slice(0, settings.numOfFeatures);
        const previewExamples: any[][] = [];
        const maxExamples = dataGroup.examples < settings.numOfExamples ? dataGroup.examples : settings.numOfExamples;
        for (let example = 0; example < maxExamples; ++example) {
            previewExamples.push([]);
            for (let feature = 0; feature < previewFeatures.length; ++feature) {
                previewExamples[example].push(dataGroup.features[feature].examples[example]);
            }
        }
        return new DataGroupViewModel({
            id: dataGroup.id,
            label: dataGroup.label,
            experimentId: dataGroup.experimentId,
            numOfExamples: dataGroup.examples,
            numOfFeatures: dataGroup.features.length,
            previewExamples,
            previewFeatures,
            previewFeatureTypes,
        });
    }
    
}

