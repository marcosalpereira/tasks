import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DataService } from '../data.service';
import * as moment from 'moment';
import { Event } from '../event.model';
import { DateUtil } from '../date-util';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  summaryChart: Chart;

  constructor(private dataService: DataService) { }

  ngOnInit() {
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

    const events = this.dataService.getEvents();
    const fim = moment(new Date(events[0].startDate));
    const ini = moment(events[events.length - 1].startDate);
    console.log({ini, fim});
    const base = +ini.format('YYYYMMDD');
    const end = +fim.format('YYYYMMDD');
    const qtdDias = end - base + 1;

    const total = new Array(qtdDias);
    total.fill(0);

    const tmpMap = events.reduce(function (map, event: Event) {
      if (event.endDate) {
        const startMoment = moment(event.startDate);
        const minutes = DateUtil.durationMinutes(startMoment, moment(event.endDate));
        const dia = +startMoment.format('YYYYMMDD') - base;
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

    for (const [name, data] of Object.entries(tmpMap)) {
      options.series.push({ name, data });
    }
    options.series.push({ name: 'Total', data: total });

    options.xAxis.categories = [];
    let index = 0;
    for (let dia = ini; index < qtdDias; index++) {
      options.xAxis.categories[index] = dia.format('DD/MM/YYYY');
      dia = dia.add(1, 'days');
    }
    this.summaryChart = new Chart(options);
  }


}


