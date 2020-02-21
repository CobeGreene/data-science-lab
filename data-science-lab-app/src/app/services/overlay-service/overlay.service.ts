import { OverlayComponent } from '../../shared/overlay/overlay.component';

export abstract class OverlayService {

    abstract register(component: OverlayComponent);
    abstract close();

}
