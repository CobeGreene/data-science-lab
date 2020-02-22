import { RoutesHandler } from './routes-handler';

describe('Angular Routes Handler', () => {

    let handler: RoutesHandler;

    it('invalid route should return error', () => {
        handler = new RoutesHandler([]);
        expect(() => {
            throw handler.invalidRoute();
        }).toThrowError();
    });

    it('get with no routes should throw error', () => {
        handler = new RoutesHandler([]);

        expect(() => {
            handler.get(0);
        }).toThrowError();
    });
    
    it('get with routes but pass offset should throw error', () => {
        handler = new RoutesHandler(['a', 'b']);

        expect(() => {
            handler.get(2);
        }).toThrowError();
    });

    it('get should return first route', () => {
        handler = new RoutesHandler(['a']);
        expect(handler.get(0)).toBe('a');
    });

    it('has should return true for first route', () => {
        handler = new RoutesHandler(['a']);
        expect(handler.has(0)).toBeTruthy();
    });
    
    it('has should return false for no route', () => {
        handler = new RoutesHandler([]);
        expect(handler.has(0)).toBeFalsy();
    });

    it('is a number should return true for string', () => {
        handler = new RoutesHandler(['12']);
        expect(handler.isNumber(0)).toBeTruthy();
    });
    
    it('is a number should return true for number', () => {
        handler = new RoutesHandler([12]);
        expect(handler.isNumber(0)).toBeTruthy();
    });
    
    it('is a number should return false for string 123b', () => {
        handler = new RoutesHandler(['123b']);
        expect(handler.isNumber(0)).toBeFalsy();
    });

    it('done should return true for no routes', () => {
        handler = new RoutesHandler([]);
        expect(handler.done()).toBeTruthy();
    });
    
    it('done should return false for routes', () => {
        handler = new RoutesHandler(['abc']);
        expect(handler.done()).toBeFalsy();
    });

    it('has should return true for routes', () => {
        handler = new RoutesHandler(['abc']);
        expect(handler.has(0)).toBeTruthy();
    });
    
    it('has should return false for pass routes', () => {
        handler = new RoutesHandler(['abc']);
        expect(handler.has(1)).toBeFalsy();
    });

    it('skip should move and return false with routes', () => {
        handler = new RoutesHandler(['1', '2', '3']);
        handler = handler.skip(1);
        expect(handler.get(0)).toBe('2');
    });


});

