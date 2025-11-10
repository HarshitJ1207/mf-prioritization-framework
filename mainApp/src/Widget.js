import React, { useEffect, useRef } from "react";
import _ from "lodash";
import { Chart } from "chart.js/auto";

export default function Widget() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Example lodash usage - process module federation data
  const modules = [
    { name: 'headerApp', port: 3001, priority: 'high', size: 245 },
    { name: 'mainApp', port: 3003, priority: 'high', size: 312 },
    { name: 'footerApp', port: 3002, priority: 'low', size: 189 },
  ];

  const highPriorityModules = _.filter(modules, { priority: 'high' });
  const lowPriorityModules = _.filter(modules, { priority: 'low' });
  const totalSize = _.sumBy(modules, 'size');
  const averageSize = _.meanBy(modules, 'size');
  const sortedBySize = _.orderBy(modules, ['size'], ['desc']);
  const moduleNames = _.map(modules, 'name');

  useEffect(() => {
    // Example chart.js usage - bar chart showing module sizes
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: _.map(modules, 'name'),
          datasets: [{
            label: 'Module Size (KB)',
            data: _.map(modules, 'size'),
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 206, 86, 0.8)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Federated Module Sizes'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Size (KB)'
              }
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
    <main
      style={{
        flex: 1,
        padding: "2em",
        backgroundColor: "#f5f5f5",
      }}
      data-e2e="MAIN_APP__WIDGET"
    >
      <h1>Main Content Component (High Priority)</h1>
      <p>This is the main content area loaded from mainApp.</p>

      {/* Lodash example */}
      <div style={{ marginTop: "2em", padding: "1.5em", backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
        <h3>📦 Lodash Data Processing Example</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em', marginTop: '1em' }}>
          <div style={{ padding: '1em', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>High Priority Modules:</strong>
            <ul style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
              {_.map(highPriorityModules, m => (
                <li key={m.name}>{m.name} - {m.size}KB</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '1em', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>Low Priority Modules:</strong>
            <ul style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
              {_.map(lowPriorityModules, m => (
                <li key={m.name}>{m.name} - {m.size}KB</li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '1em', padding: '1em', backgroundColor: 'white', borderRadius: '4px' }}>
          <strong>Statistics:</strong>
          <ul style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
            <li>Total Size: {totalSize}KB</li>
            <li>Average Size: {_.round(averageSize, 2)}KB</li>
            <li>Largest: {_.first(sortedBySize)?.name} ({_.first(sortedBySize)?.size}KB)</li>
            <li>All Modules: {_.join(moduleNames, ', ')}</li>
          </ul>
        </div>
      </div>

      {/* Chart.js example */}
      <div style={{ marginTop: "2em", padding: "1.5em", backgroundColor: "white", borderRadius: "8px" }}>
        <h3>📊 Chart.js Visualization Example</h3>
        <div style={{ height: '300px', marginTop: '1em', padding: '1em', borderRadius: '4px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div style={{ marginTop: "2em", padding: "1em", backgroundColor: "#fff3e0", borderRadius: "4px" }}>
        <h2>About Module Federation</h2>
        <p>
          This host application demonstrates Module Federation by loading:
        </p>
        <ul>
          <li><strong>Header</strong> - headerApp (port 3001) - High Priority</li>
          <li><strong>Main</strong> - mainApp (port 3003) - High Priority</li>
          <li><strong>Footer</strong> - footerApp (port 3002) - Low Priority</li>
        </ul>
        <p>
          Webpack Module Federation allows multiple separate builds to form a single application.
          These separate builds act like containers and can expose and consume code between builds,
          creating a single, unified application.
        </p>
      </div>
    </main>
  );
}

