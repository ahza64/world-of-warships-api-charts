import { useState, useEffect } from "react"
import { Form } from "react-bootstrap"
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
import "./CompareGraph.css"

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
  const [nation, setNation] = useState("japan")
  const [shipClass, setShipClass] = useState("Destroyer")

  const labels = []
  const dataSet = []

  useEffect(() => {
    const baseUrl = `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=5dd2dcfbe6731a702bb74e3ccd2d7a4c&type=${shipClass}&nation=${nation}&fields=name%2C+default_profile.armour.health`
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
  }, [nation, shipClass])

  data.map((item, idx) => {
    labels.push(item.name)
    dataSet.push(item.default_profile.armour.health)
  })

  const updateNation = (e) => {
    console.log("e", e.target.value);
    setNation(e.target.value)
  }

  const updateShipClass = (e) => {
    setShipClass(e.target.value)
  }

  return (
    <div className="bar-chart">
      <Bar
        height="500px"
        width="1000em"
        options={{
          responsive: false,
          plugins: {
            legend: {
              position: 'top',
              display: true,
              labels: {
                color: "white"
              }
            },
            title: {
              display: true,
              text: 'Compare Chart',
              color: "white"
            },
          },
          scales: {
            x: {
              ticks: {
                color: "white",
                font: {
                  size: 14
                }
              }
            },
            y: {
              ticks: {
                color: "white",
              }
            }
          }
        }}
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Dataset 1',
              data: dataSet,
              backgroundColor: "gold",
            }
          ],
        }}
      />
      <div className="compare-graph-control-btn-grp">
        <div className="compare-graph-nation-btn">
          <Form.Select aria-label="Default select example" onChange={updateNation} >
            <option value="japan">Japanese</option>
            <option value="usa">USA</option>
            <option value="ussr">Russians</option>
            <option value="germany">Germans</option>
            <option value="uk">British</option>
            <option value="france">French</option>
            <option value="italy">Italian</option>
          </Form.Select>
        </div>
        <div className="compare-graph-class-btn">
          <Form.Select onChange={updateShipClass} >
            <option value="Destroyer">Destroyers</option>
            <option value="Cruiser">Cruisers</option>
            <option value="Battleship">Battleships</option>
          </Form.Select>
        </div>
      </div>
    </div>
  )
}
