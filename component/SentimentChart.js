"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentChart({ data }) {

  const chartData = {
    labels: ["Positive", "Negative", "Mixed"],
    datasets: [
      {
        data: [data.positive, data.negative, data.mixed],
        backgroundColor: ["green", "red", "orange"],
      },
    ],
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Audience Sentiment</h3>
      <Pie data={chartData} />
    </div>
  );
}