import '../../setNonce';
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Chart } from "chart.js/auto";
import("./Widget.css");

export default function Widget() {
  const [state, setState] = useState("footer app");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Example lodash usage - process performance metrics
  const performanceMetrics = [
    { metric: 'Load Time', value: 1.2, unit: 's' },
    { metric: 'Time to Interactive', value: 2.5, unit: 's' },
    { metric: 'First Contentful Paint', value: 0.8, unit: 's' },
    { metric: 'Bundle Size', value: 189, unit: 'KB' },
  ];

  const fastestMetric = _.minBy(performanceMetrics, 'value');
  const slowestMetric = _.maxBy(performanceMetrics, 'value');
  const averageValue = _.meanBy(performanceMetrics, 'value');
  const metricNames = _.map(performanceMetrics, 'metric');

  useEffect(() => {
    // Example chart.js usage - doughnut chart for performance breakdown
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Header', 'Main', 'Footer', 'Host'],
          datasets: [{
            label: 'Load Time Distribution',
            data: [15, 35, 20, 30],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'white'
              }
            },
            title: {
              display: true,
              text: 'Load Time Distribution',
              color: 'white'
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <footer className="footer-widget" data-e2e="FOOTER_APP__WIDGET">
      <div className="footer-container">
        <h3>Footer Component (Low Priority)</h3>
        <p>&copy; 2024 Module Federation Demo. All rights reserved.</p>
        <p>{`This is a federated footer component from ${state}`}</p>

        {/* Lodash example */}
        <div className="footer-section">
          <strong>📦 Lodash Performance Analysis:</strong>
          <div className="metrics-grid">
            {_.map(performanceMetrics, metric => (
              <div key={metric.metric} className="metric-card">
                <div className="metric-label">{metric.metric}</div>
                <div className="metric-value">
                  {metric.value}{metric.unit}
                </div>
              </div>
            ))}
          </div>
          <div className="metric-summary">
            <p>Fastest: {fastestMetric?.metric} ({fastestMetric?.value}{fastestMetric?.unit})</p>
            <p>Slowest: {slowestMetric?.metric} ({slowestMetric?.value}{slowestMetric?.unit})</p>
            <p>Average: {_.round(averageValue, 2)}</p>
            <p>Metrics tracked: {_.join(metricNames, ', ')}</p>
          </div>
        </div>

        {/* Chart.js example */}
        <div className="footer-section">
          <strong>📊 Chart.js Load Time Distribution:</strong>
          <div className="chart-wrapper">
            <div className="chart-inner">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
