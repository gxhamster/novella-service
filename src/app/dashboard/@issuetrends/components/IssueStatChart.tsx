"use client";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "chartjs-adapter-date-fns";

type IssueStatChartProps = {
  data: {
    dates: any[];
    issues: any[];
  };
};

export default function IssueStatChart({ data }: IssueStatChartProps) {
  Chart.register(CategoryScale);

  console.log(data);

  const [chartData, setChartData] = useState({
    labels: data.dates,
    datasets: [
      {
        label: "Number of books issued",
        data: data.issues,
        borderColor: "#4589ff",
        backgroundColor: "#4589ff",
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
              },
              type: "time",
              time: {
                tooltipFormat: "dd MMM yyyy",
                unit: "day",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of books issued",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Books Issued",
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
