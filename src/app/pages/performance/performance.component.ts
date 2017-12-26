import { ServerDataSource } from 'ng2-smart-table';
import { typeSourceSpan } from '@angular/compiler';
import { fdatasync } from 'fs';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PerformanceService } from './performance.service';
import * as ClockChart from  './performance.clock';
import * as GaugeChart from  './performance.gauge';
declare var $: any;
@Component({
  selector: 'ngx-performance',
  templateUrl: './performance.html',
  styleUrls: ['./performance.component.scss'],
  providers: [PerformanceService],
})
export class PerformanceComponent implements OnInit, OnDestroy {
    protected activitySummaryData: any;
    protected performance: boolean
    protected activitySummaryOption: any;
    protected activitySummaryOptionTemp: any;
    protected themeSubscription: any;
    public periodStart: string;
    public periodEnd: string;
    @Input('userID') userID: number;
    private sub: any;
    protected color: any;
    constructor(private performanceService: PerformanceService,
    private theme: NbThemeService, private route: ActivatedRoute) {
        $( function() {
            $( document ).tooltip({
                items: '.appTooltip',
                position: { my: 'center top', at: 'center top' },
                tooltipClass: 'tooltipClass',
            });
        } );
        this.periodStart = '0';
        this.periodEnd = '0';
        this.activitySummaryData = [ ];
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            this.activitySummaryOption = {
                domain: ['#00D977', '#FFE81C', '#FF386A',
                colors.warningLight, colors.dangerLight],
            };
            this.color = {productive: '#00D977', unproductive: '#FFE81C',
                unclassified: '#FF386A'};
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
    ngOnInit() {
        this.loadPerformance();
        this.taskSetting = {
            mode: 'inline',
            hideSubHeader: true,
            actions: false,
            columns: {
                taskName: {
                    title: 'Name',
                    filter: false,
                },
                taskComplexity: {
                    title: 'Complexity',
                    filter: false,
                },
                isDaily: {
                    title: 'Type',
                    filter: false,
                },
                taskSource: {
                    title: 'Source',
                    filter: false,
                },
                taskPriority: {
                    title: 'Priority',
                    filter: false,
                },
                assignmentDate: {
                    title: 'Assignment Date',
                    filter: false,
                },
                targetDate: {
                    title: 'Target',
                    filter: false,
                },
                taskStatus: {
                    title: 'Status',
                    filter: false,
                },
                completedDate: {
                    title: 'Completed',
                    filter: false,
                },
            },
        };
    }
    protected selectedPiePeriod: string;
    private originalPerformanceData: any;
    private totalTime: number;
    protected totalString: string;
    protected productiveString: string;
    protected unproductiveString: string;
    protected unclassifiedString: string;
    protected userDailies: any;
    protected dailyView: any;
    protected workingDays: number;
    protected taskSetting: any;
    protected taskSource: any;
    protected completedTask: boolean;
    loadPerformance() {
        this.completedTask = false;
        this.loadTask();
        localStorage.removeItem('performanceNotification');
        this.userDailies = [
                {name: '', series : []},
            ];
        this.totalTime = 0;
        this.selectedPiePeriod = 'thisWeek';
        const payload = {
            userID: this.userID,
            periodStart: this.periodStart,
            periodEnd: this.periodEnd,
            numOfResult: 10,
        };
        this.performanceService.getUserPerformance(payload).subscribe((data) => {
            this.activitySummaryData = [
                { name: 'Productive', value: data.productiveDuration },
                { name: 'Unproductive', value: data.unproductiveDuration },
                { name: 'Unclassified', value: data.unclassifiedDuration },
            ];
            this.totalTime += (data.productiveDuration +
                data.unproductiveDuration + data.unclassifiedDuration);
            this.productiveString = this.hhmmss(data.productiveDuration);
            this.unproductiveString = this.hhmmss(data.unproductiveDuration);
            this.unclassifiedString = this.hhmmss(data.unclassifiedDuration);
            this.totalString = this.hhmmss(this.totalTime);
            this.workingDays = data.workDays;
            const gaugeConfig = {
                keystroke: data.keystrokePerHour,
                maxKeystroke: data.maxKeystrokePerHour,
                mouseclick: data.mouseClickPerHour,
                maxMouseclick: data.maxMouseClickPerHour,
            };
            GaugeChart(gaugeConfig);
        });
        this.performanceService.getUserDaily(payload).subscribe((data) => {
            const tempUserDailies: Array<any> = new Array();
            for (let i = 0 ; i < data.performances.length ; i ++) {
                tempUserDailies.push({
                    name: data.performances[i].sessionDate,
                    series: [
                        {
                            name: 'Productive',
                            value: data.performances[i].productiveDuration,
                        },

                        {
                            name: 'Unproductive',
                            value: data.performances[i].unproductiveDuration,
                        },

                        {
                            name: 'Unclassified',
                            value: data.performances[i].unclassifiedDuration,
                        },
                    ],
                });
            }
            this.userDailies = tempUserDailies.map(x => Object.assign({}, x));
            if ( this.userDailies.length < 5 ) {
                this.dailyView = [1000, 150];
            } else if ( this.userDailies.length < 10 ) {
                this.dailyView = [1000, 200];
            } else if ( this.userDailies.length < 75 ) {
                this.dailyView = [1000, 300];
            } else if ( this.userDailies.length < 250 ) {
                this.dailyView = [1000, 400];
            } else if ( this.userDailies.length < 500 ) {
                this.dailyView = [1000, 500];
            } else {
                this.dailyView = [1000, 1000];
            }
        });
    }
    loadTask() {
        const payload = {
            userID: this.userID,
            periodStart: this.periodStart,
            periodEnd: this.periodEnd,
            isOngoingOnly: !this.completedTask,
        };
        this.performanceService.getUserTask(payload).subscribe((data) => {
            if (data.tasks == null) {
                this.taskSource.load();
            } else {
                this.taskSource.load(data.tasks);
            }
        });
    }
    protected showDetail: boolean;
    protected userDailyActivities: any;
    protected totalDuration: number;
    protected isClockSelected: boolean;
    protected timelineData: any;
    protected minDuration: number;
    onBarSelect(event) {
        this.isClockSelected = true;
        this.showDetail = true;
        const payload = {
            userID: this.userID,
            periodStart: event.series,
            periodEnd: event.series,
            sessionDate: event.series,
        };
        this.performanceService.getUserDailyActivity(payload).subscribe((data) => {
            this.userDailyActivities = data.performances;
            this.totalDuration = data.totalDuration;
        });
        this.timelineData = [
                {name: '', series : []},
            ];
        this.performanceService.getUserDailyTimeline(payload).subscribe((data) => {
            let tempTimelineData: Array<any> = new Array();
            let amClocks = [];
            let pmClocks = [];
            let productives = []; let unproductives = []; let unclassified = [];
            this.minDuration = 0;
            for (let element of data.performances ) {
                //let element = data.performances[i];
                const el = {
                        start: element.activityHour2,
                        end: element.activityHour2 + 1,
                        color: element.activityCategory === 'Productive' ?
                            this.color.productive : element.activityCategory === 'Unproductive' ?
                            this.color.unproductive : this.color.unclassified,
                    };
                if (element.AMPM === 'AM') {
                    amClocks.push(el);
                } else {
                    pmClocks.push(el);
                }
                if (element.activityCategory == 'Productive') {
                    if (element.productiveDuration > this.minDuration) {
                        this.minDuration = element.productiveDuration;
                    }
                    productives.push({
                        name: element.activityHourLabel,
                        value: element.productiveDuration,
                    });
                } else if (element.activityCategory == 'Unproductive') {
                    if (element.unproductiveDuration > this.minDuration) {
                        this.minDuration = element.unproductiveDuration;
                    }
                    unproductives.push({
                        name: element.activityHourLabel,
                        value: element.unproductiveDuration,
                    });
                } else {
                    if (element.unclassifiedDuration > this.minDuration) {
                        this.minDuration = element.unclassifiedDuration;
                    }
                    unclassified.push({
                        name: element.activityHourLabel,
                        value: element.unclassifiedDuration,
                    });
                }
            }
            this.minDuration = this.minDuration * 1.2;
            tempTimelineData = [{
                name: 'Productive',
                series: productives,
            }, {
                name: 'Unproductive',
                series: unproductives,
            }, {
                name: 'Unclassified',
                series: unclassified,
            }];
            this.timelineData = tempTimelineData.map(x => Object.assign({}, x));
            const clockConfig = {
                clocksArea : amClocks,
                faceColor: this.color.unproductive,
                selector: '.clockChart',
            };
            ClockChart(clockConfig);

            const clockConfig2 = {
                clocksArea : pmClocks,
                faceColor: this.color.unproductive,
                selector: '.clockChart2',
            };
            ClockChart(clockConfig2);
        });
    }
    getColor(item: any): string {
        if (item.activityClassification == 'Productive'){
            return this.color.productive;
        } else if (item.activityClassification == 'Unproductive'){
            return this.color.unproductive;
        } else {
            return this.color.unclassified;
        }
    }
    onPiePeriodChange(event) { }
    formatPieLabel(event): string {
        return event.label + '<br/><span class="custom-label-text">'
        + (event.value / this.totalTime * 100) + '%</span>';
    }
    pad(num) {
        return parseInt(("0"+num).slice(-2), 10);
    }
    hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    const hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return this.pad(hours) + ' hours ' + this.pad(minutes) + ' minutes '; // +pad(secs);
    }
}
