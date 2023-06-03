import './App.css';
import SReactTable from './Components/SReactTable';
import {useEffect, useState} from 'react'
function App() {
  const [tableData, setTableData] = useState(null)
  useEffect(() => {
    let fetchData = async () => { 
      let tableData = JSON.parse(sessionStorage.getItem("tableData"));
      if(!tableData) {
        let res = await fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json')
        let resJson = await res.json();
        setTableData(resJson)
      } else {
        setTableData(tableData)
      }
    }
    fetchData()
  },[])
  return (
    <div className="App">
      {tableData ? <SReactTable tableData={tableData}/>: <h1>Loading...</h1>}
    </div>
  );
}

export default App;
