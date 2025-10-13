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
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function ClassPerformanceChart() {
  const data = {
    labels: ['Term 1 2023', 'Term 2 2023', 'Term 3 2023', 'Term 1 2024', 'Term 2 2024'],
    datasets: [
      {
        label: 'Form 1',
        data: [78, 82, 85, 87, 89],
        borderColor: '#1B5E20',
        backgroundColor: 'rgba(27, 94, 32, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Form 2',
        data: [75, 78, 80, 83, 85],
        borderColor: '#0D47A1',
        backgroundColor: 'rgba(13, 71, 161, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Form 3',
        data: [72, 74, 77, 79, 82],
        borderColor: '#FF8F00',
        backgroundColor: 'rgba(255, 143, 0, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Form 4',
        data: [68, 70, 73, 76, 78],
        borderColor: '#7B1FA2',
        backgroundColor: 'rgba(123, 31, 162, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Form 5',
        data: [65, 67, 70, 73, 75],
        borderColor: '#D32F2F',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
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
          text: 'Average Score (%)'
        },
        min: 60,
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
        <CardTitle>Class Performance Trends</CardTitle>
        <CardDescription>
          Academic performance trends across all class levels over time
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
