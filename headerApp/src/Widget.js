import '../../setNonce';
import React, { useEffect, useRef } from "react";
import _ from "lodash";
import { Chart } from "chart.js/auto";
import("./Widget.css");

export default function Widget() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Example lodash usage - process some data
  const navigationItems = ['Home', 'Products', 'Services', 'About', 'Contact'];
  const processedItems = _.map(navigationItems, (item, index) => ({
    id: index,
    name: item,
    slug: _.kebabCase(item),
  }));

  const itemCount = _.size(processedItems);
  const firstItem = _.first(processedItems);

  useEffect(() => {
    // Example chart.js usage - mini chart in header
    if (chartRef.current) {
      // Destroy previous chart if exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{
            label: 'Page Views',
            data: [120, 190, 150, 220, 180],
            borderColor: '#61dafb',
            backgroundColor: 'rgba(97, 218, 251, 0.1)',
            tension: 0.4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            }
          },
          scales: {
            y: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
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
    <header className="header-widget" data-e2e="HEADER_APP__WIDGET">
      <div className="header-container">
        <h1>Header Component (High Priority)</h1>
        <p>This is a federated header component from headerApp</p>

        {/* Lodash example */}
        <div className="header-section">
          <strong>📦 Lodash Example:</strong>
          <p>
            Navigation items: {itemCount} | First: {firstItem?.name} ({firstItem?.slug})
          </p>
          <div className="nav-items">
            {_.map(processedItems, item => (
              <span key={item.id} className="nav-item">
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Chart.js example */}
        <div className="header-section">
          <strong>📊 Chart.js Example - Weekly Page Views:</strong>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </header>
  );
}
