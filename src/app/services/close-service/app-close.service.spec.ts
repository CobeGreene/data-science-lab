import { AppCloseService } from "./app-close.service";
import { Messenger } from "../messenger";
import { MockZone } from "../mock-zone";
import { AppCloseEvent } from "../../../../shared/events";


describe('Angular App Close Service', () => {
    let service: AppCloseService;
    let messenger: Messenger;

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish']);
        service = new AppCloseService(messenger, new MockZone({}));
    });

    it('close should call publish', () => {
        service.close();
        expect(messenger.publish).toHaveBeenCalledTimes(1);
        expect(messenger.publish).toHaveBeenCalledWith(AppCloseEvent);
    });

});
