import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export default function CompareGraph() {


  const [data, setData] = useState([])
  const labels = []
  const dataSet = []

  useEffect(() => {
    const baseUrl = "https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=5dd2dcfbe6731a702bb74e3ccd2d7a4c&type=Destroyer&nation=japan&fields=name%2C+default_profile.armour.health"
    fetch(baseUrl, {method: "GET"})
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then((data) => {
        setData(Object.values(data.data))
      })
      .catch((err) => {
        // setHasNoResults(true)
        // setError(err)
      })
      .finally(() => {
        // setLoading(false)
      })
  }, [])

  data.map((item, idx) => {
    labels.push(item.name)
    dataSet.push(item.default_profile.armour.health)
    console.log("data map", dataSet);
  })
  const fetchData = () => {

  }

  console.log("data state", data);

  return (
    <div>
      <Bar
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Bar Chart',
            },
          },
        }}
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Dataset 1',
              data: dataSet,
              backgroundColor: "yellow",
            }
          ],
        }}
      />
      <div>
        <button onClick={fetchData}>
          fetch data
        </button>
      </div>
    </div>
  )
}
