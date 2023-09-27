import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData, ChartOptions
} from "chart.js";
import { Bar} from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface DataPoint {
    label: string
    value: number
  }

interface ChartBarProps {
    data: {}
  }
const ChartBar: React.FC<ChartBarProps> = ( {data} ) => {
    const [myChartData, setMyChartData] = useState<ChartData<'bar'>>()
    const options:ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
              position: 'top'
            }
        }
      }

    const chart = ()=> {
        var chartData: ChartData<'bar'> = {datasets: []}
        Object.keys(data).forEach( (key) => {
            // chart labels are the labels of the first data
            if (chartData.labels === undefined) {
               chartData.labels =  (data[key as keyof typeof data] as DataPoint[]).map(s=>s["label"])
            }
            chartData.datasets.push ( {
                label: key,
                data: (data[key as keyof typeof data] as DataPoint[]).map(s=>s["value"]),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            })
        })
        setMyChartData( chartData)
    }
    
    useEffect(() => {
        chart();
     },[data])

  


    if (myChartData != undefined) {
    return (
      < >
      <Bar  data={myChartData} options={options} >
      </Bar>
      </>
    )
   }
   return ( <></>);
  
}
export  {ChartBar};
