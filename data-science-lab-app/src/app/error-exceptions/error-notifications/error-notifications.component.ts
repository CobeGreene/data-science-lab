import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from '../../services/error-services';
import { ErrorExceptionList } from '../../models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-error-notifications',
    templateUrl: './error-notifications.component.html',
    styleUrls: []
})
export class ErrorNotificationsComponent implements OnInit, OnDestroy {
    
    errorExceptionList: ErrorExceptionList;

    constructor(private errorService: ErrorService) {

    }

    ngOnInit(): void {
        this.errorExceptionList = this.errorService.all();
        this.errorService.errorsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: ErrorExceptionList) => {
                this.errorExceptionList = value;
            });
    }

    ngOnDestroy(): void {

    }

    onRemoveNotification(id: number) {
        this.errorService.remove(id);
    }

}
