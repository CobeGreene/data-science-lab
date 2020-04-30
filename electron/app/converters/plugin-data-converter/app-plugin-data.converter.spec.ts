import { PluginData } from 'data-science-lab-core';
import { DatasetObject, FeatureObject } from '../../models';
import { AppPluginDataConverter } from './app-plugin-data.converter';

describe('Electron App Plugin Data Converter', () => {

    let converter: AppPluginDataConverter;

    beforeAll(() => {
        converter = new AppPluginDataConverter();
    });


    it('single example with one feature should a group data with a number feature', () => {
        const fetchPluginData = {
            features: ['foo'],
            examples: [[1]]
        };
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features[0].name).toBe('foo');
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[0].examples[0]).toBe(1);
    });

    it('single example with no feature should return a group data with a number feature', () => {
        const fetchPluginData = {
            features: [],
            examples: [[1]]
        };
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features[0].name.length).toBeGreaterThan(1);
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[0].examples[0]).toBe(1);
    });

    it('single example with many feature should return a group with a number feature', () => {
        const fetchPluginData = {
            features: ['one', 'two'],
            examples: [[1]]
        };
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features[0].name).toBe('one');
        expect(dataGroup[0].features.length).toBe(1);
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[0].examples[0]).toBe(1);
    });

    it('multiple example with many feature should return a single group data', () => {
        const fetchPluginData = {
            features: ['one', 'two', 'three'],
            examples: [[1, true, '3'], [1, false, '3'], [1, true, '3']]
        };
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features.length).toBe(3);
        expect(dataGroup[0].features[0].name).toBe('one');
        expect(dataGroup[0].features[1].name).toBe('two');
        expect(dataGroup[0].features[2].name).toBe('three');
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[1].type).toBe('boolean');
        expect(dataGroup[0].features[2].type).toBe('string');
    });

    it('multiple examples with different sizes should return multiple group datas', () => {
        const fetchPluginData = {
            features: ['one', 'two', 'three'],
            examples: [[1, true, '3'], [1, false, '3'], [1, true, '3'], [1]]
        };
        const dataGroups = converter.convert(fetchPluginData);
        expect(dataGroups.length).toBe(2);
        expect(dataGroups[0].features.length).toBe(1);
        expect(dataGroups[1].features.length).toBe(2);
        expect(dataGroups[0].features[0].name).toBe('one');
        expect(dataGroups[1].features[0].name).toBe('two');
        expect(dataGroups[1].features[1].name).toBe('three');
        expect(dataGroups[0].features[0].type).toBe('number');
        expect(dataGroups[1].features[0].type).toBe('boolean');
        expect(dataGroups[1].features[1].type).toBe('string');
        expect(dataGroups[0].features[0].examples.length).toBe(4);
    });

});
