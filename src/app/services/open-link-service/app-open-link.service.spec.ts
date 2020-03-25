import { AppOpenLinkService } from "./app-open-link.service";
import { Messenger } from "../messenger";
import { MockZone } from "../mock-zone";
import { OpenLinkEvent } from "../../../../shared/events";


describe('Angular App Open Link Service', () => {
    let service: AppOpenLinkService;
    let messenger: Messenger;

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish']);
        service = new AppOpenLinkService(messenger, new MockZone({}));
    });

    it('open should call publish', () => {
        service.open('link');
        expect(messenger.publish).toHaveBeenCalledTimes(1);
        expect(messenger.publish).toHaveBeenCalledWith(OpenLinkEvent, 'link');
    });

});
