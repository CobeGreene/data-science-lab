import { Component, OnInit, ViewChildren, ElementRef, QueryList, HostListener, OnDestroy, AfterViewInit } from "@angular/core";
import { Algorithm } from "../../../../../../shared/models";
import { FocusService } from "../../../../services/focus-service";
import { SidebarService } from "../../../../services/sidebar-service";
import { ShortcutService } from "../../../../services/shortcut-service";
import { TabFactory } from "../../../../factory/tab-factory";
import { TabService } from "../../../../services/tab-service";
import { AlgorithmService } from "../../../../services/algorithm-service";
import { FocusAreas } from "../../../../constants";
import { untilComponentDestroyed } from "@w11k/ngx-componentdestroyed";


interface SidebarAlgorithmData {
    selected: number;
    inFocus?: boolean;
}

@Component({
    selector: 'app-sidebar-algorithm',
    templateUrl: './sidebar-algorithm.component.html',
    styleUrls: ['./sidebar-algorithm.component.css']
})
export class SidebarAlgorithmComponent implements OnInit, OnDestroy, AfterViewInit {
    data: SidebarAlgorithmData;

    algorithms: Algorithm[];

    @ViewChildren('algorithmCmp', { read: ElementRef }) algorithmComponents: QueryList<ElementRef<HTMLElement>>;

    constructor(
        private focusService: FocusService,
        private sidebarService: SidebarService,
        private shortcutService: ShortcutService,
        private tabFactory: TabFactory,
        private tabService: TabService,
        private algorithmService: AlgorithmService
    ) {

    }

    @HostListener('click', ['$event']) onFocusSidebar(event: MouseEvent) {
        this.focusService.set(FocusAreas.Sidebar);
        event.stopPropagation();
    }

    ngOnInit() {
        this.data = this.sidebarService.get<SidebarAlgorithmData>('sidebar-algorithm',
            {
                selected: 0,
            });

        this.focusService.focusChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.data.inFocus = value === FocusAreas.Sidebar;
            });

        this.data.inFocus = this.focusService.current() === FocusAreas.Sidebar;

        this.algorithmService.algorithmsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe(() => {
                this.initializeAlgorithms();
            });

        this.initializeAlgorithms();
    }


    ngAfterViewInit() {
        this.shortcutService.subscribe('arrowup', this.onMoveUp);
        this.shortcutService.subscribe('arrowdown', this.onMoveDown);
        this.shortcutService.subscribe('enter', this.onEnter);
    }

    ngOnDestroy() {
        this.shortcutService.unsubscribe('arrowup', this.onMoveUp);
        this.shortcutService.unsubscribe('arrowdown', this.onMoveDown);
        this.shortcutService.unsubscribe('enter', this.onEnter);
        this.sidebarService.set('sidebar-algorithm', this.data);
    }

    initializeAlgorithms() {
        this.algorithms = this.algorithmService.all();
        if (this.data.selected >= this.algorithms.length && this.algorithms.length !== 0) {
            this.data.selected = this.algorithms.length - 1;
        } else if (this.algorithms.length === 0) {
            this.data.selected = 0;
        }
        setTimeout(() => {
            this.scrollIntoViewAlgorithmSelected();
        });
    }

    onMoveUp = () => {
        if (this.data.inFocus) {
            if (this.data.selected > 0) {
                this.data.selected -= 1;
                this.scrollIntoViewAlgorithmSelected();
            }
        }
    }

    onMoveDown = () => {
        if (this.data.inFocus) {
            if (this.data.selected < this.algorithms.length - 1 && this.algorithms.length !== 0) {
                this.data.selected += 1;
                this.scrollIntoViewAlgorithmSelected();
            }
        }
    }


    onEnter = () => {
        if (this.data.inFocus) {
            this.onAlgorithmSelected(this.data.selected);
        }
    }

    onAlgorithmSelected(selected: number) {
        this.data.selected = selected;
        this.scrollIntoViewAlgorithmSelected();
        const tab = this.tabFactory.create(['experiment', this.algorithms[selected].experimentId, 'algorithm', this.algorithms[selected].id]);
        this.tabService.openTab(tab);
    }


    scrollIntoViewAlgorithmSelected() {
        this.scrollIntoViewSelected(this.data.selected);
    }

    scrollIntoViewSelected(select: number) {
        const element = this.algorithmComponents.toArray()[select];
        if (element !== undefined) {
            (element.nativeElement).scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
        }
    }
}

