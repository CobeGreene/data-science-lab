import { getType } from './index';

describe('Electron Helpers Test', () => {

    it('get type should return number for 1', () => {
        expect(getType(1)).toEqual('number');
    });

    it('get type should return string for test', () => {
        expect(getType('text')).toEqual('string');
    });

    it('get type should return boolean for bool', () => {
        expect(getType(false)).toEqual('boolean');
    });

    it('get type should return object for obj', () => {
        class Foo {
            constructor(public bar: number, public baz: string) {

            }
        }
        expect(getType(new Foo(3, 'abc'))).toEqual('object');
    });

    it('get type should return number[] for number array', () => {
        expect(getType([1, 2, 3])).toEqual('number[]');
    });

    it('get type should return string[] for string array', () => {
        expect(getType(['a', 'b', 'c'])).toEqual('string[]');
    });

    it('get type should return object[][] for object double array', () => {
        class Foo {
            constructor(public bar: number, public baz: string) {

            }
        }
        const data: Foo[][] = [[new Foo(1, 'foo'), new Foo(2, 'bar')], [new Foo(3, 'baz'), new Foo(4, 'qux')]];
        expect(getType(data)).toEqual('object[][]');
    });

});