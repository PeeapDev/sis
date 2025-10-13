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

export function EnrollmentChart() {
  const data = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Primary Schools',
        data: [850000, 820000, 780000, 890000, 920000, 950000],
        borderColor: '#1B5E20',
        backgroundColor: 'rgba(27, 94, 32, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Secondary Schools',
        data: [320000, 310000, 295000, 340000, 365000, 380000],
        borderColor: '#0D47A1',
        backgroundColor: 'rgba(13, 71, 161, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Technical Schools',
        data: [45000, 42000, 38000, 48000, 52000, 58000],
        borderColor: '#FF8F00',
        backgroundColor: 'rgba(255, 143, 0, 0.1)',
        fill: true,
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
          text: 'Year'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Students'
        },
        ticks: {
          callback: function(value: any) {
            return (value / 1000) + 'K'
          }
        }
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
        <CardTitle>Student Enrollment Trends</CardTitle>
        <CardDescription>
          Student enrollment across different school levels over the past 6 years
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
