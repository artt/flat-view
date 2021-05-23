import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {

  const [directory, setDirectory] = React.useState([])

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
              console.log(l)
            })
        }
        else {
          console.log('oh nooooo')
        }
      })

  }

  // React.useEffect(() => {
  //   fetch("/ping")
  //   // .then(res => console.log(res))
  //   .then(res => res.json())
  //   .then(data => setFolders(data))
  // }, [])
  
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <div>
            <TextField label="Directory" value={directory} onChange={e => setDirectory(e.target.value)} />
            <Button variant="contained" onClick={() => scan(directory)}>Scan</Button>
          </div>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
