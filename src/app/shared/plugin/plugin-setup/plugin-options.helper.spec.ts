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
});