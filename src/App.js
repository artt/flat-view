import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {

  const [directory, setDirectory] = React.useState('~/GitHub/pier-source/content/members')
  const [tableData, setTableData] = React.useState([])

  function convertObject(o) {
    let out = {}
    if ('default' in o) {
      out = o.default
      delete o.default
    }
    Object.entries(o).map(([variant, oo]) => {
      Object.entries(oo).map(([k, v]) => {
        out[`${k}_${variant}`] = v
      })
    })
    return out
  }

  function scan(scanDir) {
    fetch('/scan', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({dir: scanDir}),
    })
      .then(res => {
        if (res.status === 200) {
          res.json()
            .then(l => {
              let objectArray = Object.entries(l).map(([url, o]) => {
                return {
                  url: url,
                  ...convertObject(o),
                }
              })
              console.log(objectArray)
              setTableData(objectArray.map(x => ({date: x.date, id: x.id, title: x.title})))
              // setTableData(objectArray.map(x => ({name: x.title_th, email: x.email_th})))
              // setTableData(objectArray.map(x => ({en: x.title_en, th: x.title_th})))
              // setTableData(objectArray)
            })
        }
        else {
          console.log('oh nooooo')
        }
      })

  }

  const defaultColDef = {
    editable: true,
  };

  const columnTypes = {
    // paragraph: {
    //   wrapText: true,
    //   autoHeight: true,
    // }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <div>
            <TextField label="Directory" value={directory} onChange={e => setDirectory(e.target.value)} />
            <Button variant="contained" onClick={() => scan(directory)}>Scan</Button>
          </div>
          <div className="ag-theme-alpine-dark" style={{height: 400, width: "80vw"}}>
            <AgGridReact
              rowData={tableData}
              defaultColDef={defaultColDef}
              enableRangeSelection={true}
              columnTypes={columnTypes}
            >
              {tableData && tableData.length > 0 &&
                Object.keys(tableData[0]).map(k => {
                  console.log(k)
                  return <AgGridColumn field={k} type={k.substring(0, 4) === "body" && "paragraph"} />
                })
              }
            </AgGridReact>
          </div>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
