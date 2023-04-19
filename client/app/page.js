'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';

// Local
import { AddSource } from './AddSource';
import { Canvas } from './Canvas';
import { styles } from './styles';

// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, AppBar, IconButton, Toolbar, TextField } from '@mui/material';
import { Popup } from 'reactjs-popup';
import CssBaseline from '@mui/material/CssBaseline';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  const [boxes, setBoxes] = useState({});
  const [img, setImg] = useState("");
  const [ver, setVer] = useState("");

  const updateImg = (e) => {
    let updatedBoxes = {...boxes};
    updatedBoxes[id].title = e.target.value;
    setBoxes(updatedBoxes);
  }

  const updateVer = (e) => {
    setBoxes();
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="flex flex-col justify-items-start p-16">
        {/* ---- App Bar ---- */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Yesterday
              </Typography>
              <AddSource className='my-2' boxes={boxes} setBoxes={setBoxes} />
              <Popup
                trigger={
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ ml: 1 }}
                  >
                    <SettingsIcon />
                  </IconButton>
                }
                modal
                nested
              >
                {close => (
                  <div className="container flex flex-col justify-start justify-items-start space-y-4 py-8 bg-neutral-900 rounded-lg border border-neutral-700 w-screen">
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <IconButton
                          size="medium"
                        color="inherit"
                        aria-label="menu"
                        onClick={close}
                        >
                          <CloseIcon />
                        </IconButton>
                        <div className="self-center">
                          <Typography variant="h5">
                            Settings
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <Typography variant="h6">Spark image: </Typography>
                      <TextField fullWidth={true} variant="filled" label="Image" value={img} onChange={(e) => setImg(e.target.value)} />
                      <TextField fullWidth={true} variant="filled" label="Tag" value={ver} onChange={(e) => setVer(e.target.value)} />
                    </div>
                  </div>
                )}
              </Popup>
            </Toolbar>
          </AppBar>
        </Box>
        {/* ---- Drag and drop ---- */}
        <div className={styles.home.dragArea}>
          <DndProvider backend={HTML5Backend}>
            <Canvas boxes={boxes} setBoxes={setBoxes} />
          </DndProvider>
        </div>
      </main>
    </ThemeProvider>
  );
}