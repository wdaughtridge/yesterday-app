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
import { Box, Typography, AppBar, IconButton, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  const [boxes, setBoxes] = useState({});

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="flex flex-col justify-items-start p-16">
        {/* ---- App Bar ---- */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Yesterday
              </Typography>
              <AddSource className='my-2' boxes={boxes} setBoxes={setBoxes} />
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