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

    it('isValidText should return false with pattern abc', () => {
        expect(isValidText('abc', new TextOption({
            id: 'text',
            label: 'any',
            pattern: '^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'
        }))).toBeFalsy();
    });




});