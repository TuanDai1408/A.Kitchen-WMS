import { isDarkModeActive } from './theme';
import { renderKpi } from './ui-feedback';
import { TrendPeriod } from './types';

declare const ApexCharts: any;
declare const flatpickr: any;
declare const lucide: any;

export let chartInboundOutbound: any = null;
export let chartSafetyGauge: any = null;
export let chartValueTrend: any = null;
export let chartItemDetail: any = null;
export let chartAuditComparison: any = null;

export function initTailadminCharts(): void {
  const isDark = isDarkModeActive();
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridBorder = isDark ? '#1E293B' : '#F1F5F9';

  if (typeof ApexCharts === 'undefined') return;

  // 1. Inbound - Outbound Monthly Bar Chart
  const elBar = document.getElementById('inboundOutboundChart');
  if (elBar && !chartInboundOutbound) {
    const optionsBar = {
      colors: ['#19723C', '#10B981'],
      chart: {
        fontFamily: "'Be Vietnam Pro', sans-serif",
        type: 'bar',
        height: 280,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '42%',
          borderRadius: 8,
          borderRadiusApplication: 'around'
        }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      series: [
        { name: 'Nhập kho (₫)', data: [420, 490, 310, 540, 580, 630, 720, 690, 750, 820, 890, 920] },
        { name: 'Xuất kho (₫)', data: [380, 450, 340, 490, 520, 600, 680, 660, 710, 790, 840, 860] }
      ],
      xaxis: {
        categories: ['T12', 'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: textColor, fontSize: '11px' } }
      },
      yaxis: {
        labels: {
          style: { colors: textColor, fontSize: '11px' },
          formatter: (val: number) => `${val} Tr`
        }
      },
      legend: { show: false },
      grid: { borderColor: gridBorder, strokeDashArray: 4 },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        y: { formatter: (val: number) => `${val.toLocaleString('vi-VN')} Triệu ₫` }
      }
    };
    chartInboundOutbound = new ApexCharts(elBar, optionsBar);
    chartInboundOutbound.render();
  }

  // 2. Safety Stock Fulfillment Gauge Chart
  const elGauge = document.getElementById('safetyStockGaugeChart');
  if (elGauge && !chartSafetyGauge) {
    const optionsGauge = {
      series: [92.4],
      colors: ['#599973'],
      chart: {
        fontFamily: "'Be Vietnam Pro', sans-serif",
        type: 'radialBar',
        height: 270,
        sparkline: { enabled: true }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: { size: '75%' },
          track: {
            background: isDark ? '#1C243D' : '#E8EAEE',
            strokeWidth: '100%',
            margin: 5
          },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: '32px',
              fontWeight: '800',
              offsetY: -30,
              color: isDark ? '#FFFFFF' : '#1D2939',
              formatter: (val: number) => val + '%'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#19723C'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      labels: ['Safety Fulfillment']
    };
    chartSafetyGauge = new ApexCharts(elGauge, optionsGauge);
    chartSafetyGauge.render();
  }

  // 3. Inventory Value Trend Chart
  const elTrend = document.getElementById('inventoryValueTrendChart');
  if (elTrend && !chartValueTrend) {
    const optionsTrend = {
      series: [
        { name: 'Tổng giá trị tồn (Triệu ₫)', data: [1050, 1120, 1080, 1190, 1220, 1180, 1258] },
        { name: 'Định mức tối thiểu (Triệu ₫)', data: [800, 800, 800, 800, 800, 800, 800] }
      ],
      colors: ['#19723C', '#F59E0B'],
      chart: {
        fontFamily: "'Be Vietnam Pro', sans-serif",
        type: 'area',
        height: 300,
        toolbar: { show: false }
      },
      stroke: {
        curve: 'smooth',
        width: [3, 2],
        dashArray: [0, 5]
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      dataLabels: { enabled: false },
      grid: { borderColor: gridBorder, strokeDashArray: 4 },
      xaxis: {
        categories: ['13/11', '14/11', '15/11', '16/11', '17/11', '18/11', '19/11'],
        labels: { style: { colors: textColor, fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: textColor, fontSize: '11px' },
          formatter: (val: number) => `${val} Tr`
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: isDark ? '#CBD5E1' : '#475569' }
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        y: { formatter: (val: number) => `${val.toLocaleString('vi-VN')} Triệu ₫` }
      }
    };
    chartValueTrend = new ApexCharts(elTrend, optionsTrend);
    chartValueTrend.render();
  }

  // Initialize Flatpickr Date Picker
  const datePickerEl = document.getElementById('inventoryTrendDatePicker');
  if (datePickerEl && typeof flatpickr !== 'undefined') {
    flatpickr(datePickerEl, {
      mode: 'range',
      dateFormat: 'd/m/Y',
      defaultDate: [new Date(Date.now() - 6 * 86400000), new Date()],
      locale: typeof flatpickr.l1ons !== 'undefined' ? flatpickr.l1ons.vn : 'default'
    });
  }
}

export function changeTrendPeriod(period: TrendPeriod | string, btn?: HTMLElement): void {
  document.querySelectorAll('.trend-btn').forEach(b => {
    b.classList.remove('active', 'bg-white', 'text-gray-800', 'shadow-xs', 'dark:bg-white/10', 'dark:text-white');
    b.classList.add('text-gray-500', 'dark:text-gray-400');
  });

  if (btn) {
    btn.classList.add('active', 'bg-white', 'text-gray-800', 'shadow-xs', 'dark:bg-white/10', 'dark:text-white');
    btn.classList.remove('text-gray-500', 'dark:text-gray-400');
  }

  if (!chartValueTrend) return;

  if (period === 'week') {
    chartValueTrend.updateOptions({
      xaxis: { categories: ['13/11', '14/11', '15/11', '16/11', '17/11', '18/11', '19/11'] }
    });
    chartValueTrend.updateSeries([
      { name: 'Tổng giá trị tồn (Triệu ₫)', data: [1050, 1120, 1080, 1190, 1220, 1180, 1258] },
      { name: 'Định mức tối thiểu (Triệu ₫)', data: [800, 800, 800, 800, 800, 800, 800] }
    ]);
  } else if (period === 'month') {
    chartValueTrend.updateOptions({
      xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'] }
    });
    chartValueTrend.updateSeries([
      { name: 'Tổng giá trị tồn (Triệu ₫)', data: [1020, 1150, 1190, 1258] },
      { name: 'Định mức tối thiểu (Triệu ₫)', data: [800, 800, 800, 800] }
    ]);
  } else if (period === 'quarter') {
    chartValueTrend.updateOptions({
      xaxis: { categories: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4 (Hiện tại)'] }
    });
    chartValueTrend.updateSeries([
      { name: 'Tổng giá trị tồn (Triệu ₫)', data: [950, 1080, 1160, 1258] },
      { name: 'Định mức tối thiểu (Triệu ₫)', data: [800, 800, 800, 800] }
    ]);
  }
}


export function updateAuditKpisAndChart(items: any[]): void {
  if (!items || !items.length) {
    renderKpi('kkMetricTotalSkus', { value: 0, unit: 'Mã', isCurrency: false });
    renderKpi('kkMetricMatchRate', { text: '100%', sub: 'Độ tin cậy cao' });
    renderKpi('kkMetricDiffValue', { value: 0, sub: 'Theo giá vốn kho' });
    renderKpi('kkMetricDiffCount', { value: 0, unit: 'Mã', isCurrency: false, sub: 'Biên bản giải trình' });
    if (chartAuditComparison) {
      chartAuditComparison.updateOptions({ xaxis: { categories: [] } });
      chartAuditComparison.updateSeries([{ name: 'Sổ sách', data: [] }, { name: 'Thực tế', data: [] }]);
    }
    return;
  }

  const total = items.length;
  let matchCount = 0;
  let diffCount = 0;
  let totalClosingValue = 0;

  items.forEach(it => {
    const tonTruoc = parseFloat(it.closing_t10 || it.closing_t9 || 0) || 0;
    const suDung = (it.usage_t11 !== null && it.usage_t11 !== undefined) ? (parseFloat(it.usage_t11) || 0) : 0;
    const tonCuoi = tonTruoc - suDung;
    const price = parseFloat(it.price) || 0;
    totalClosingValue += Math.max(0, tonCuoi) * price;
    if (it.usage_t11 === null || it.usage_t11 === undefined || suDung === 0) {
      matchCount++;
    } else {
      diffCount++;
    }
  });

  const topItems = items.slice(0, 10);
  const categories = topItems.map(i => i.item_name ? (i.item_name.length > 16 ? i.item_name.slice(0, 16) + '...' : i.item_name) : i.item_code);
  const bookData: number[] = [];
  const actualData: number[] = [];

  topItems.forEach(it => {
    const tonTruoc = parseFloat(it.closing_t10 || it.closing_t9 || 0) || 0;
    const suDung = (it.usage_t11 !== null && it.usage_t11 !== undefined) ? (parseFloat(it.usage_t11) || 0) : 0;
    const tonCuoi = tonTruoc - suDung;
    bookData.push(parseFloat(tonTruoc.toFixed(1)));
    actualData.push(parseFloat(tonCuoi.toFixed(1)));
  });

  const matchRate = total > 0 ? ((matchCount / total) * 100).toFixed(1) : '100.0';

  renderKpi('kkMetricTotalSkus', { value: total, unit: 'Mã', isCurrency: false, sub: 'Theo site' });
  renderKpi('kkMetricMatchRate', {
    text: `${matchRate}%`,
    deltaGood: parseFloat(matchRate) >= 95,
    sub: 'Độ tin cậy cao'
  });
  renderKpi('kkMetricDiffValue', {
    value: totalClosingValue,
    sub: 'Theo giá vốn kho'
  });
  renderKpi('kkMetricDiffCount', {
    value: diffCount,
    unit: 'Mã',
    isCurrency: false,
    deltaGood: diffCount === 0,
    sub: 'Biên bản giải trình'
  });

  // Render or update auditComparisonChart
  const chartEl = document.getElementById('auditComparisonChart');
  if (chartEl && typeof ApexCharts !== 'undefined') {
    const isDark = isDarkModeActive();
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridBorder = isDark ? '#1E293B' : '#F1F5F9';

    if (chartAuditComparison) {
      chartAuditComparison.updateOptions({
        xaxis: { categories: categories }
      });
      chartAuditComparison.updateSeries([
        { name: 'Sổ sách', data: bookData },
        { name: 'Thực tế', data: actualData }
      ]);
    } else {
      const options = {
        series: [
          { name: 'Sổ sách', data: bookData },
          { name: 'Thực tế', data: actualData }
        ],
        colors: ['#19723C', '#10B981'],
        chart: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
          type: 'bar',
          height: 240,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '45%',
            borderRadius: 6
          }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
          categories: categories,
          labels: { style: { colors: textColor, fontSize: '11px' } }
        },
        yaxis: {
          labels: { style: { colors: textColor, fontSize: '11px' } }
        },
        grid: { borderColor: gridBorder, strokeDashArray: 4 },
        legend: { show: false },
        tooltip: {
          theme: isDark ? 'dark' : 'light'
        }
      };
      chartAuditComparison = new ApexCharts(chartEl, options);
      chartAuditComparison.render();
    }
  }
}
