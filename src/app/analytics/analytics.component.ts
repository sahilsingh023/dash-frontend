
import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartType, Chart } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  searchTerm: string = '';
  chart: any
  data: any = [];
  filteredData: any
  lineChart: any;
  data123: any;
  lineLabel: any = [];
  doughnutChart: any;
  filterByYear: number | null = null;
  filterByIntensity: number | null = null;
  searchText: any = '';
  selectedEndYear: number | null = null;
  selectedIntensity: number | null = null;
  intensities: any = []
  endYears: any = []
  @ViewChild('lineChartCanvas')
  private lineChartCanvas!: ElementRef;
  doughnutData: any = []
  occurrences: any = [];
  distinctValues: any = [];
  colors = [
    "#FF0000", // Red
    "#0000FF", // Blue
    "#008000", // Green
    "#FFFF00", // Yellow
    "#800080", // Purple
    "#FFA500", // Orange
    "#FFC0CB", // Pink
    "#A52A2A", // Brown
    "#000000", // Black
    "#FFFFFF", // White
    "#808080", // Gray
    "#000080", // Navy
    "#008080", // Teal
    "#800000", // Maroon
    "#808000", // Olive
    "#40E0D0", // Turquoise
    "#E6E6FA", // Lavender
    "#B784A7", // Mauve
    "#FF00FF", // Fuchsia
    "#4B0082", // Indigo
    "#36454F", // Charcoal
    "#FF7F50", // Coral
    "#F5DEB3", // Beige
    "#FFDB58", // Mustard
    "#800020", // Burgundy
    "#8B0000", // Rust
    "#87CEEB", // Sky blue
    "#50C878", // Emerald green
    "#98FB98", // Mint green
    "#FFE5B4", // Peach
    "#FA8072", // Salmon
    "#F0E68C", // Khaki
    "#6A5ACD", // Slate blue
    "#A0522D", // Sienna
    "#CCCCFF", // Periwinkle
    "#B76E79", // Rose gold
    "#4682B4", // Steel blue
    "#D2691E", // Cinnamon
    "#E5E4E2", // Platinum
    "#FFB347", // Apricot
    "#C8A2C8", // Lilac
    "#F7E7CE", // Champagne
    "#FFC300", // Turmeric
    "#7FFF00", // Chartreuse
    "#E0115F", // Ruby
    "#191970", // Midnight blue
    "#556B2F", // Olive green
    "#DA70D6", // Orchid
    "#CC4E5C", // Terracotta
    "#7DF9FF"  // Electric blue
  ];
  totalIntensity:any =0;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    for (let i = 0; i <= 100; i++) {
      this.intensities.push(i);
      this.endYears.push(2000 + i)
    }
    this.http.get('http://localhost:4200/getAllData').subscribe((response: any) => {
      this.data123 = response.data;
      this.createDataset();
      this.createLineChart();
      this.renderDoughnutChart();
      this.filterTable();
    });
  }

  renderDoughnutChart() {
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: this.distinctValues,
        datasets: [
          {
            data: this.occurrences,
            backgroundColor: this.colors,
          },
        ],
      },options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }as ChartOptions<'doughnut'>,
    });
  }
  

  createDataset() {
    this.data123.forEach((val: any) => {
      this.totalIntensity = this.totalIntensity + val.intensity;
      this.data.push(val.intensity)
      val.topic ? this.lineLabel.push(val.topic) : this.lineLabel.push('others')
      val.region ? this.doughnutData.push(val.region) : this.doughnutData.push('others')
    })
    this.distinctValues = [...new Set(this.doughnutData)];
    this.occurrences = this.distinctValues.reduce((acc: any, curr:any) => {
      const count = this.doughnutData.filter((val: any) => val === curr).length; // count the number of times each distinct value occurs in the original array
      acc.push(count);
      return acc;
    }, []); 
  }

  createLineChart() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.lineLabel,
        datasets: [
          {
            label: 'Intensity Wise Data',
            data: this.data,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              borderRadius: 5
            }
          }
        },scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }as ChartOptions<'line'>
    });
  }

  filterByEndYear(year: number | null) {
    this.filterByYear = year;
  }

  filterByIntensityLevel(intensity: number | null) {
    this.filterByIntensity = intensity;
  }

  filterTable() {
    this.filteredData = this.data123;
    if (this.filterByYear) {
      this.filteredData = this.data123.filter((item: any) => item.end_year == this.filterByYear);
    }
    if (this.filterByIntensity) {
      this.filteredData = this.data123.filter((item: any) => item.intensity == this.filterByIntensity);
    }
    if (this.searchTerm) {
      this.filteredData = this.data123.filter((item: any) => item.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    return this.filteredData;
  }

  search(e: any) {
    this.searchTerm = e.target.value;
    this.filterTable()
  }


  handleBackspace(e: any) {
    if (e.keyCode === 8) {
      this.searchTerm = e.target.value;
      this.filterTable();
    }
  }

  selectIntensity(e: any) {
    console.log("--", e.target.value);
    this.filterByIntensity = e.target.value;
    if (this.filterByIntensity) {
      this.filterTable();
    }
    else {
      this.filteredData = this.data123
    }
  }
  selectYear(e: any) {
    console.log("--", e.target.value);
    this.filterByIntensity = e.target.value;
    if (this.filterByIntensity) {
      this.filterTable();
    }
    else {
      this.filteredData = this.data123
    }
  }
}

