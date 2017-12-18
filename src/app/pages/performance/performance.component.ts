import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PerformanceService } from './performance.service';

@Component({
  selector: 'ngx-performance',
  templateUrl: './performance.html',
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

    constructor(private performanceService: PerformanceService,
    private theme: NbThemeService, private route: ActivatedRoute) {
        this.periodStart = '0';
        this.periodEnd = '0';
        this.activitySummaryData = [ ];
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            this.activitySummaryOption = {
                domain: [colors.primaryLight, colors.infoLight, colors.successLight,
                colors.warningLight, colors.dangerLight],
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
    ngOnInit() {
            this.loadPerformance();
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
    loadPerformance() {
        this.userDailies = [
                {name: '', series : []}
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
        });
        this.performanceService.getUserDaily(payload).subscribe((data) => {
            
            var tempUserDailies: Array<any> = new Array();
            for(let i = 0 ; i < data.performances.length ; i ++){
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
            if(this.userDailies.length < 5) {
                this.dailyView = [1000, 150];
            }
            else if(this.userDailies.length < 10) {
                this.dailyView = [1000, 200];
            }
            else if(this.userDailies.length < 75) {
                this.dailyView = [1000, 300];
            }
            else if(this.userDailies.length < 250) {
                this.dailyView = [1000, 400];
            }
            else if(this.userDailies.length < 500) {
                this.dailyView = [1000, 500];
            } else {
                this.dailyView = [1000, 1000];
            }
        });
    }
    onBarSelect(event) {

    }
    onPiePeriodChange(event) {
        
    }
    formatPieLabel(event): string {
        return event.label + '<br/><span class="custom-label-text">'
        + (event.value / this.totalTime * 100) + '%</span>';
    }
    pad(num) {
        return parseInt(("0"+num).slice(-2), 10);
    }
    hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs%60;
    var hours = Math.floor(minutes/60)
    minutes = minutes%60;
    return this.pad(hours)+" hours "+ this.pad(minutes)+" minutes ";//+pad(secs);
    }
}
