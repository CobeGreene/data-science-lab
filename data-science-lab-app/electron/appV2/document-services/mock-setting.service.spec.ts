import { MockDocumentService } from './mock-document-service';

describe('Electron Mock Documents Service Tests', () => {
    let documents: MockDocumentService;

    beforeEach(() => {
        documents = new MockDocumentService();
    });

    it('has should return false for empty settings', () => {
        expect(documents.has('not-found')).toBeFalsy();
    });

    it('set should has property after set', () => {
        documents.set('obj', 5);
        expect(documents.has('obj')).toBeTruthy();
    });

    it('get should return number', () => {
        documents.set('obj', 5);
        expect(documents.get<number>('obj')).toBe(5);
    });

    it('get should return default value for non-existant obj', () => {
        expect(documents.get<number>('obj', 5)).toBe(5);
    });

    it('get should return value not default for existant obj', () => {
        documents.set('obj', 1);
        expect(documents.get<number>('obj', 5)).toBe(1);
    });

    it('get should throw when non-default for non-existant obj', () => {
        expect(() => {
            documents.get<number>('obj');
        }).toThrowError();
    });
    
});

