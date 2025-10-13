'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function ResultsChart() {
  const data = {
    labels: ['Term 1 2023', 'Term 2 2023', 'Term 3 2023', 'Term 1 2024', 'Term 2 2024'],
    datasets: [
      {
        label: 'Mathematics',
        data: [75, 78, 82, 85, 85],
        borderColor: '#1B5E20',
        backgroundColor: 'rgba(27, 94, 32, 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'English Language',
        data: [70, 72, 75, 76, 78],
        borderColor: '#0D47A1',
        backgroundColor: 'rgba(13, 71, 161, 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Physics',
        data: [68, 72, 78, 80, 82],
        borderColor: '#FF8F00',
        backgroundColor: 'rgba(255, 143, 0, 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Chemistry',
        data: [72, 74, 76, 75, 76],
        borderColor: '#7B1FA2',
        backgroundColor: 'rgba(123, 31, 162, 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Biology',
        data: [80, 82, 85, 87, 88],
        borderColor: '#388E3C',
        backgroundColor: 'rgba(56, 142, 60, 0.1)',
        fill: false,
        tension: 0.4,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Academic Term'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Score (%)'
        },
        min: 0,
        max: 100,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Progress</CardTitle>
        <CardDescription>
          Your performance trends across different subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
