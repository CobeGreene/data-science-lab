import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Visualization } from '../../../../../../shared/models';
import { VisualizationsService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-visualization-card',
    templateUrl: './experiment-visualization-card.component.html',
    styleUrls: []
})
export class ExperimentVisualizationCardComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() visualization: Visualization;

    @ViewChild('visualCmp', { static: false}) visualComponent: ElementRef;

    constructor(private service: VisualizationsService) {
        
    }

    ngOnDestroy(): void {

    }

    ngOnInit(): void {
        this.service.updatedVisualization
            .pipe(untilComponentDestroyed(this))    
            .subscribe((value) => {
                if (value.id === this.visualization.id) {
                    this.visualization = value;
                }
            });
    }

    ngAfterViewInit() {
        const frame = this.visualComponent.nativeElement as HTMLIFrameElement;
        frame.srcdoc = this.visualization.visual;
        // tslint:disable-next-line: deprecation
        frame.frameBorder = '0px';
    }
}
