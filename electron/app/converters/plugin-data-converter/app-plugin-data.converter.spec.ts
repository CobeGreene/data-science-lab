import { PluginData } from 'data-science-lab-core';
import { DatasetObject, FeatureObject } from '../../models';
import { AppPluginDataConverter } from './app-plugin-data.converter';

describe('Electron App Plugin Data Converter', () => {

    let converter: AppPluginDataConverter;

    beforeAll(() => {
        converter = new AppPluginDataConverter();
    });

    it('get type should return number for 1', () => {
        expect(converter.getType(1)).toEqual('number');
    });

    it('get type should return string for test', () => {
        expect(converter.getType('text')).toEqual('string');
    });

    it('get type should return boolean for bool', () => {
        expect(converter.getType(false)).toEqual('boolean');
    });

    it('get type should return object for obj', () => {
        class Foo {
            constructor(public bar: number, public baz: string) {

            }
        }
        expect(converter.getType(new Foo(3, 'abc'))).toEqual('object');
    });

    it('get type should return number[] for number array', () => {
        expect(converter.getType([1, 2, 3])).toEqual('number[]');
    });

    it('get type should return string[] for string array', () => {
        expect(converter.getType(['a', 'b', 'c'])).toEqual('string[]');
    });

    it('get type should return object[][] for object double array', () => {
        class Foo {
            constructor(public bar: number, public baz: string) {

            }
        }
        const data: Foo[][] = [[new Foo(1, 'foo'), new Foo(2, 'bar')], [new Foo(3, 'baz'), new Foo(4, 'qux')]];
        expect(converter.getType(data)).toEqual('object[][]');
    });


    it('single example with one feature should a group data with a number feature', () => {
        const fetchPluginData = new PluginData({
            features: ['foo'],
            examples: [[1]]
        });
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features[0].name).toBe('foo');
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[0].examples[0]).toBe(1);
    });

    it('single example with no feature should return a group data with a number feature', () => {
        const fetchPluginData = new PluginData({
            features: [],
            examples: [[1]]
        });
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features[0].name.length).toBeGreaterThan(1);
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[0].examples[0]).toBe(1);
    });

    it('single example with many feature should return a group with a number feature', () => {
        const fetchPluginData = new PluginData({
            features: ['one', 'two'],
            examples: [[1]]
        });
        const dataGroup = converter.convert(fetchPluginData);
        expect(dataGroup[0].features[0].name).toBe('one');
        expect(dataGroup[0].features.length).toBe(1);
        expect(dataGroup[0].features[0].type).toBe('number');
        expect(dataGroup[0].features[0].examples[0]).toBe(1);
    });

    it('multiple example with many feature should return a single group data', () => {
        const fetchPluginData = new PluginData({
            features: ['one', 'two', 'three'],
            examples: [[1, true, '3'], [1, false, '3'], [1, true, '3']]
        });
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
        const fetchPluginData = new PluginData({
            features: ['one', 'two', 'three'],
            examples: [[1, true, '3'], [1, false, '3'], [1, true, '3'], [1]]
        });
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
