'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function PerformanceChart() {
  const data = {
    labels: ['Western Area', 'Northern', 'Southern', 'Eastern'],
    datasets: [
      {
        label: 'Pass Rate (%)',
        data: [85, 72, 78, 68],
        backgroundColor: 'rgba(27, 94, 32, 0.8)',
        borderColor: '#1B5E20',
        borderWidth: 1,
      },
      {
        label: 'Attendance Rate (%)',
        data: [92, 88, 85, 82],
        backgroundColor: 'rgba(13, 71, 161, 0.8)',
        borderColor: '#0D47A1',
        borderWidth: 1,
      },
      {
        label: 'Completion Rate (%)',
        data: [88, 75, 80, 71],
        backgroundColor: 'rgba(255, 143, 0, 0.8)',
        borderColor: '#FF8F00',
        borderWidth: 1,
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
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Provinces'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Percentage (%)'
        },
        beginAtZero: true,
        max: 100,
      }
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance by Province</CardTitle>
        <CardDescription>
          Comparison of key educational metrics across Sierra Leone provinces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
