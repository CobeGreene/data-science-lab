import { Request } from './request';
import { Response } from './response';

export interface WebService {
    send(request: Request): Promise<Response>;
}
