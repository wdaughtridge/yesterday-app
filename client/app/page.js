'use client';
import { Inter } from 'next/font/google'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AddSource } from './AddSource';
import { Canvas } from './Canvas';
import { useState } from 'react'
import { CircularProgress } from '@mui/material';
import { styles } from './styles';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [boxes, setBoxes] = useState({
    1: { top: 20, left: 80, title: '/usr/src/app/job_file.py' },
    2: { top: 180, left: 20, title: 'New Source 2' },
  });
  const [jobID, setJobID] = useState(-1);
  const [jobRes, setJobRes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async (code) => {
    setIsLoading(true);
    console.log(code);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: code })
    };
    const response = await fetch('http://127.0.0.1:3000/submit', requestOptions);
    const data = await response.json();
    setJobRes(data.data);
    setJobID(data.id);
    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className='py-4'>
        <AddSource className='my-2' boxes={boxes} setBoxes={setBoxes} />
        <button className="group my-2 rounded-lg border border-neutral-700 bg-neutral-800/30 px-4 py-4 transition-colors hover:border-gray-600 hover:bg-gray-700" onClick={async () => await sendRequest(boxes[1].title)}>Submit Code</button>
      </div>
      <div className='py-4'>
        {isLoading ? 
          <CircularProgress /> 
          : (jobID != -1) ? <div>
              <p>Job ID: {jobID}</p>
                <br/>
              <p>Job Result: {jobRes}</p>
            </div> : <div />
        }
      </div>
      <div>
      </div>
      <div className={styles.home.dragArea}>
        <DndProvider backend={HTML5Backend}>
          <Canvas boxes={boxes} setBoxes={setBoxes} />
        </DndProvider>
      </div>
    </main>
  )
}