import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DataService } from '../data.service';
import * as moment from 'moment';
import { Event } from '../event.model';
import { DateUtil } from '../date-util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  eventsChanged$: Subscription;
  summaryChart: Chart;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.eventsChanged$ = this.dataService.eventsChanged$.subscribe(
      events => this.renderChart(events)
    );
  }
  renderChart(events: Event[]): void {
    if (!events || events.length === 0) { return; }

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Apropriações',
      },
      xAxis: {
        categories: [],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Horas decimais',
        },
        stackLabels: {
          enabled: true,
          style: {
              fontWeight: 'bold',
              color: 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: <b>{point.y}</b><br/>Total: <b>{point.stackTotal}</b>'
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true,
                  color: 'white'
              }
          }
      },
      series: [],
    };

    const fim = moment(events[0].startDate).startOf('day');
    const ini = moment(events[events.length - 1].startDate).startOf('day');
    const qtdDias = fim.diff(ini, 'days') + 1;

    const tmpMap = events.reduce(function (map, event: Event) {
      if (event.endDate) {
        const startMoment = moment(event.startDate);
        const minutes = DateUtil.durationMinutes(startMoment, moment(event.endDate));
        const daysAfterFirstDay = startMoment.startOf('day').diff(ini, 'days');
        const key = event.task.name;

        let data: number[] = map[key];
        if (!data) {
          data = new Array(qtdDias);
          data.fill(null);
          data[daysAfterFirstDay] = minutes;
          map[key] = data;
        } else {
          data[daysAfterFirstDay] += minutes;
        }
      }
      return map;
    }, new Map());

    for (const [name, dados] of Object.entries(tmpMap)) {
      const data = dados.map(n => n ? Math.round( (n / 60) * 100 ) / 100 : null);
      options.series.push({ name, data });
    }

    options.xAxis.categories = [];
    let dia = moment(ini);
    for (let count = 0; count < qtdDias; count++) {
      const dataIndex = options.xAxis.categories.length;
      if ( this.isWeekend(dia) && !this.existeDados(options.series, dataIndex)) {
        this.removeDados(options.series, dataIndex);
      } else {
        options.xAxis.categories.push(dia.format('D/M ddd'));
      }
      dia = dia.add(1, 'days');
    }

    this.summaryChart = new Chart(options);
  }

  isWeekend(dia: moment.Moment): boolean {
    const d = dia.toDate().getDay();
    return d === 6 || d === 0;
  }

  removeDados(series: any[], index: number): void {
    for (let i = 0; i < series.length; i++) {
      series[i].data.splice(index, 1);
    }
  }
  existeDados(series: any[], index: number): boolean {
    for (let i = 0; i < series.length; i++) {
      if (series[i].data[index]) { return true; }
    }
    return false;
  }
}


