import { useState, useEffect } from "react"
import { Form } from "react-bootstrap"
import { Bar, Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  RadialLinearScale,
  PointElement
} from 'chart.js';
import "./CompareGraph.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  RadialLinearScale,
  PointElement
);

// const baseUrl = `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=5dd2dcfbe6731a702bb74e3ccd2d7a4c&type=${shipClass}&nation=${nation}&fields=name${parametersMap[parameter]}`
const initialState = {
  shipData: [],
  shipNation: "japan",
  shipClass: "Destroyer",
  shipParameter: "hit-points",
  labels: null,
  dataSet: null
}

export default function CompareGraph() {
  const [state, setState] = useState({ ...initialState  })

  useEffect(() => {
    const parametersMap = {
      'hit-points': "%2C+default_profile.armour.health",
      'main-battery-range': "%2C+default_profile.artillery.distance",
      'concealment': "%2C+default_profile.concealment.detect_distance_by_ship"
    }
    console.log("refetch data");
    const baseUrl = `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=5dd2dcfbe6731a702bb74e3ccd2d7a4c&type=${state.shipClass}&nation=${state.shipNation}&fields=name${parametersMap[state.shipParameter]}`
    fetch(baseUrl, {method: "GET"})
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw res
    })
    .then(({data}) => {

      setState((prevState) => ({
        ...prevState,
        shipData: Object.values(data)
      }))
    })
    .catch((err) => {
      // setHasNoResults(true)
      // setError(err)
    })
    .finally(() => {
      // setLoading(false)
    })
    console.log("fetch data", state.shipData);
  }, [state.shipNation, state.shipClass, state.shipParameter])

  useEffect(() => {
    const newLabels = []
    const newData = []
    // const shipParameterMap = [
    //   {hitPoints: "default_profile.armour.health"},
    //   {mainBatteryRange: "default_profile.artillery.distance"}
    // ]
    // build global parameter state form the button? ex. add urlParams: "default_profile.armour.health" to line 133
    state.shipData.map((item, idx) => {
      if (state.shipParameter === "hit-points") {
        newData.push(item.default_profile.armour.health)
      } else if (state.shipParameter === "main-battery-range") {
        newData.push(item.default_profile.artillery.distance)
      } else if (state.shipParameter === "concealment") {
        newData.push(item.default_profile.concealment.detect_distance_by_ship)
      }
      newLabels.push(item.name)
    })
    setState((prevState) => ({
      ...prevState,
      labels: newLabels,
      dataSet: newData
    }))
  }, [state.shipData])

  const updateNation = (e) => {
    console.log("e nation", e.target.value);
    setState((prevState) => ({
      ...prevState,
      shipNation: e.target.value
    }))
  }

  const updateShipClass = (e) => {
    console.log("e class", e.target.value);
    setState((prevState) => ({
      ...prevState,
      shipClass: e.target.value
    }))
  }

  const updateParameter = (e) => {
    console.log("e pram", e.target.value);
    setState((prevState) => ({
      ...prevState,
      shipParameter: e.target.value
    }))
  }

  const nationOptions = [
    { id: "001", option: "japan", title: "Japanese" },
    { id: "002", option: "usa", title: "American" },
    { id: "003", option: "ussr", title: "Russians" },
    { id: "004", option: "germany", title: "Germans" },
    { id: "005", option: "uk", title: "British" },
    { id: "006", option: "france", title: "French" },
    { id: "007", option: "italy", title: "Italian" },
  ]

  const shipClassOptions = [
    { id: "001", option: "Destroyer", title: "Destroyers" },
    { id: "002", option: "Cruiser", title: "Cruisers" },
    { id: "003", option: "Battleship", title: "Battleships" },
  ]

  const shipParameterOptions = [
    { id: "001", option: "hit-points", title: "Hit Points" },
    { id: "002", option: "main-battery-range", title: "Main Firing Range" },
    { id: "003", option: "concealment", title: "Concealment" }
  ]

  return (
    <div>
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
                text: 'Compare Chart (live API data from wargaming.com)',
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
            labels: state.labels,
            datasets: [
              {
                label: state.parameter,
                data: state.dataSet,
                backgroundColor: "gold",
              }
            ],
          }}
        />
        <div className="compare-graph-control-btn-grp">
          <div className="compare-graph-nation-btn">
            <div style={{color: "white"}}>
              Select Ship Nation
            </div>
            <Form.Select aria-label="Default select example" onChange={updateNation}>
              {nationOptions.map((item) => (
                <option key={item.id} value={item.option}>{item.title}</option>
              ))}
            </Form.Select>
          </div>
          <div className="compare-graph-class-btn">
            <div style={{color: "white"}}>
              Select Ship Class
            </div>
            <Form.Select onChange={updateShipClass}>
              {shipClassOptions.map((item) => (
                <option key={item.id} value={item.option}>{item.title}</option>
              ))}
            </Form.Select>
          </div>
          <div className="compare-graph-parameter-btn">
            <div style={{color: "white"}}>
              Select Parameter 1
            </div>
            <Form.Select onChange={updateParameter}>
              {shipParameterOptions.map((item) => (
                <option key={item.id} value={item.option}>{item.title}</option>
              ))}
            </Form.Select>
          </div>

        </div>
      </div>
      <div className="radar-chart">
        <Radar 
        data={{
            labels: ['Hit Points/1000', 'Concealment', 'Turret Traverse', 'Rudder Shift', 'Full Speed', 'Turn Radius/10', 'Fires per Minute'],
            datasets: [
              {
                label: 'des Moines',
                backgroundColor: 'rgba(179,181,198,0.2)',
                borderColor: 'rgba(179,181,198,1)',
                pointBackgroundColor: 'rgba(179,181,198,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179,181,198,1)',
                data: [50.6, 13.9, 30, 8.6, 33, 77.0, 13.734]
              },
              {
                label: 'montana',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                data: [96.3, 17.8, 45, 22.2, 30, 95.0, 8.64]
              }
            ]
        }}
          options={{
            scales: {
              r: {
                pointLabels: {
                  color: "#fff",
                  fontSize: "48px"
                },
                grid: {
                  color: "#fff"
                },
                angleLines: {
                  color: "#fff"
                },
                gridLines: {
                  fontColor: "#fff",
                  color: "#fff"
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}
