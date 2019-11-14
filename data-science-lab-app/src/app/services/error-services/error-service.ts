import { ErrorException, ErrorExceptionList } from '../../models';
import { Subject } from 'rxjs';

export abstract class ErrorService {

    public errorsChanged: Subject<ErrorExceptionList>;

    abstract all(): ErrorExceptionList;
    abstract remove(id: number): void;
    abstract get(id: number): ErrorException;
}
