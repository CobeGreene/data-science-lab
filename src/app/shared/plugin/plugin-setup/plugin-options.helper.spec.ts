import { isValidText } from "./plugin-options.helper";
import { TextOption } from "data-science-lab-core";


describe('Angular Plugin Options Helper Tests', () => {

    it('isValidText should return true with no constraint on emtpy string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
        }))).toBeTruthy();
    });

    it('isValidText should return true with no constraint on null string', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
        }))).toBeTruthy();
    });

    it('isValidText should return true with no constraint on undefined string', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
        }))).toBeTruthy();
    });

    it('isValidText should return true with no constraint on string', () => {
        expect(isValidText('string', new TextOption({
            id: 'text',
            label: 'any',
        }))).toBeTruthy();
    });

    it('isValidText should return true with min == 0 on empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            min: 0
        }))).toBeTruthy();
    });

    it('isValidText should return true with min == 0 on null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            min: 0
        }))).toBeTruthy();
    });

    it('isValidText should return true with min == 0 on undefined', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
            min: 0
        }))).toBeTruthy();
    });

    it('isValidText should return true with min == 0 on string', () => {
        expect(isValidText('string', new TextOption({
            id: 'text',
            label: 'any',
            min: 0
        }))).toBeTruthy();
    });

    it('isValidText should return true with max == 5 on empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            max: 5
        }))).toBeTruthy();
    });

    it('isValidText should return true with max == 5 on null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            max: 5
        }))).toBeTruthy();
    });

    it('isValidText should return true with max == 5 on undefined', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
            max: 5
        }))).toBeTruthy();
    });

    it('isValidText should return true with max == 5 on texts', () => {
        expect(isValidText('text', new TextOption({
            id: 'texts',
            label: 'any',
            max: 5
        }))).toBeTruthy();
    });

    it('isValidText should return false with max == 5 on string', () => {
        expect(isValidText('string', new TextOption({
            id: 'text',
            label: 'any',
            max: 5
        }))).toBeFalsy();
    });

    it('isValidText should return true with min == 1 on string', () => {
        expect(isValidText('string', new TextOption({
            id: 'text',
            label: 'any',
            min: 1
        }))).toBeTruthy();
    });

    it('isValidText should return false with min == 10 on string', () => {
        expect(isValidText('string', new TextOption({
            id: 'text',
            label: 'any',
            min: 10
        }))).toBeFalsy();
    });

    it('isValidText should return true with pattern on empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });

    it('isValidText should return true with pattern on null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });

    it('isValidText should return true with pattern on undefined', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });

    it('isValidText should return true with pattern #333', () => {
        expect(isValidText('#333', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });

    it('isValidText should return true with pattern #FFF', () => {
        expect(isValidText('#FFF', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });
    
    it('isValidText should return true with pattern #fFf', () => {
        expect(isValidText('#fFf', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });
    
    it('isValidText should return true with pattern #FFFFFF', () => {
        expect(isValidText('#FFFFFF', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeTruthy();
    });
    
    it('isValidText should return false with pattern #FFFFF', () => {
        expect(isValidText('#FFFFF', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false with pattern #FFFFFFF', () => {
        expect(isValidText('#FFFFFFF', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false with pattern #FFFF', () => {
        expect(isValidText('#FFFF', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeFalsy();
    });

    it('isValidText should return false with pattern abc', () => {
        expect(isValidText('abc', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false with pattern abc#FFF', () => {
        expect(isValidText('abc#FFF', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeFalsy();
    });
    
    it('isValidText should return true with pattern 1,2,3,4', () => {
        expect(isValidText('1,2,3,4', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^([ ]*[0-9]+[ ]*)(,[ ]*[0-9]+[ ]*)+$'
        }))).toBeTruthy();
    });
    

    it('isValidText should return true with pattern  1 , 2  , 3 , 4 ', () => {
        expect(isValidText('  1 , 2 , 3  , 4 ', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^([ ]*[0-9]+[ ]*)(,[ ]*[0-9]+[ ]*)+$'
        }))).toBeTruthy();
    });


    it('isValidText should return false with pattern  a1 , 2  , 3 , 4 ', () => {
        expect(isValidText('a  1 , 2 , 3  , 4 ', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^([ ]*[0-9]+[ ]*)(,[ ]*[0-9]+[ ]*)+$'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false with pattern  123 ', () => {
        expect(isValidText('123  ', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^([ ]*[0-9]+[ ]*)(,[ ]*[0-9]+[ ]*)+$'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false with pattern  123 , ', () => {
        expect(isValidText('123 ,  ', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^([ ]*[0-9]+[ ]*)(,[ ]*[0-9]+[ ]*)+$'
        }))).toBeFalsy();
    });

    it('isValidText should return true with min and max a', () => {
        expect(isValidText('a', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 5
        }))).toBeTruthy();
    });
    
    it('isValidText should return true with min and max abcde', () => {
        expect(isValidText('abcde', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 5
        }))).toBeTruthy();
    });
    
    it('isValidText should return false for empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 5
        }))).toBeFalsy();
    });
    
    it('isValidText should return false for null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 5
        }))).toBeFalsy();
    });
    
    it('isValidText should return false for undefined', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 5
        }))).toBeFalsy();
    });
    
    it('isValidText should return true for min = 0 and pattern but empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            min: 0,
            pattern: 'abc'
        }))).toBeTruthy();
    });
    
    it('isValidText should return true for min = 0 and pattern but null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            min: 0,
            pattern: 'abc'
        }))).toBeTruthy();
    });
    
    it('isValidText should return true for min = 0 and pattern but undefined', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
            min: 0,
            pattern: 'abc'
        }))).toBeTruthy();
    });

    it('isValidText should return true for min = 0 and pattern and abc', () => {
        expect(isValidText('abc', new TextOption({
            id: 'text',
            label: 'any',
            min: 0,
            pattern: 'abc'
        }))).toBeTruthy();
    });
    
    it('isValidText should return false for min = 0 and pattern and ahh', () => {
        expect(isValidText('ahh', new TextOption({
            id: 'text',
            label: 'any',
            min: 0,
            pattern: 'abc'
        }))).toBeFalsy();
    });

    
    it('isValidText should return false for min = 1 and pattern and empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            pattern: 'abc'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false for min = 1 and pattern and undefined', () => {
        expect(isValidText(undefined, new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            pattern: 'abc'
        }))).toBeFalsy();
    });
    
    it('isValidText should return false for min = 1 and pattern and null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            pattern: 'abc'
        }))).toBeFalsy();
    });

    it('isValid should return true for min and max', () => {
        expect(isValidText('a', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
        }))).toBeTruthy();
    });
    
    it('isValid should return false for min and max on empty string', () => {
        expect(isValidText('', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
        }))).toBeFalsy();
    });
    
    it('isValid should return false for min and max on null', () => {
        expect(isValidText(null, new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
        }))).toBeFalsy();
    });
    
    it('isValid should return false for min and max on long', () => {
        expect(isValidText('long', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
        }))).toBeFalsy();
    });

    it('isValid should return true for all abc', () => {
        expect(isValidText('abc', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
            pattern: 'abc'
        }))).toBeTruthy();
    });
    it('isValid should return false for all abcd', () => {
        expect(isValidText('abcd', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
            pattern: 'abc'
        }))).toBeFalsy();
    });
    
    it('isValid should return false for all abc', () => {
        expect(isValidText('abc', new TextOption({
            id: 'text',
            label: 'any',
            min: 6,
            max: 12,
            pattern: '(abc)+'
        }))).toBeFalsy();
    });

    it('isValid should return for all ad', () => {
        expect(isValidText('ad', new TextOption({
            id: 'text',
            label: 'any',
            min: 1,
            max: 3,
            pattern: 'abc'
        }))).toBeFalsy();
    });





});