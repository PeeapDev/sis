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

export function StudentEnrollmentChart() {
  const data = {
    labels: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'],
    datasets: [
      {
        label: 'Current Enrollment',
        data: [245, 238, 225, 210, 185, 144],
        backgroundColor: 'rgba(27, 94, 32, 0.8)',
        borderColor: '#1B5E20',
        borderWidth: 1,
      },
      {
        label: 'Target Capacity',
        data: [250, 250, 250, 250, 200, 150],
        backgroundColor: 'rgba(13, 71, 161, 0.3)',
        borderColor: '#0D47A1',
        borderWidth: 1,
        borderDash: [5, 5],
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
          text: 'Class Level'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Students'
        },
        beginAtZero: true,
      }
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Enrollment by Class</CardTitle>
        <CardDescription>
          Current enrollment vs target capacity across all class levels
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
