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
    const options = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Apropriações',
      },
      xAxis: {
        categories: [],
      },
      yAxis: {
        title: {
          text: 'Minutos',
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [],
    };

    const fim = moment(events[0].startDate).startOf('day');
    const ini = moment(events[events.length - 1].startDate).startOf('day');
    const qtdDias = fim.diff(ini, 'days');

    console.log({ ini, fim, qtdDias });

    const total = new Array(qtdDias);
    total.fill(0);

    const tmpMap = events.reduce(function (map, event: Event) {
      if (event.endDate) {
        const startMoment = moment(event.startDate);
        const minutes = DateUtil.durationMinutes(startMoment, moment(event.endDate));
        const dia = startMoment.startOf('day').diff(ini, 'days');
        const key = event.task.name;

        let data: number[] = map[key];
        if (!data) {
          data = new Array(qtdDias);
          data.fill(0);
          data[dia] = minutes;
          map[key] = data;
        } else {
          data[dia] += minutes;
        }

        total[dia] += minutes;
      }
      return map;
    }, new Map());

    for (const [name, dados] of Object.entries(tmpMap)) {
      const data = dados.map(n => Math.round( (n / 60) * 100 ) / 100);
      options.series.push({ name, data });
    }
    options.series.push({ name: 'Total', data: total.map(n => Math.round( (n / 60) * 100 ) / 100)});

    options.xAxis.categories = [];
    let index = 0;
    for (let dia = moment(ini); index < qtdDias; index++) {
      options.xAxis.categories[index] = dia.format('DD/MM ddd');
      dia = dia.add(1, 'days');
    }
    this.summaryChart = new Chart(options);
  }
}


