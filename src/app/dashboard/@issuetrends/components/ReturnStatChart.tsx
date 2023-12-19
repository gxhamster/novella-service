"use client";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "chartjs-adapter-date-fns";

type ReturnStatChartProps = {
  data: {
    dates: any[];
    returns: any[];
  };
};

export default function ReturnStatChart({ data }: ReturnStatChartProps) {
  Chart.register(CategoryScale);

  console.log(data);

  const [chartData, setChartData] = useState({
    labels: data.dates,
    datasets: [
      {
        label: "Number of books returned",
        data: data.returns,
        borderColor: "#228BE6",
        backgroundColor: "#228BE6",
      },
    ],
  });

  return (
    <>
      <Bar
        data={chartData}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
                font: {
                  size: 14,
                },
              },
              type: "timeseries",
              time: {
                tooltipFormat: "dd MMM yyyy",
                unit: "day",
              },
            },
            y: {
              type: "linear",
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: "Number of books returned",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Books Returned",
            },
            tooltip: {
              backgroundColor: "#393939",
              titleColor: "#c6c6c6",
              bodyColor: "#e0e0e0",
            },
            legend: {
              display: false,
              labels: {
                font: {
                  size: 14,
                },
              },
            },
          },
        }}
      />
    </>
  );
}
