'use client';
import { Inter } from 'next/font/google'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Canvas } from './Canvas'
import { AddSource } from './AddSource'
import { useState } from 'react'
import { CircularProgress } from '@mui/material';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [boxes, setBoxes] = useState({
    1: { top: 20, left: 80, title: 'New Source 1' },
    2: { top: 180, left: 20, title: 'New Source 2' },
  });
  const [jobID, setJobID] = useState(-1);
  const [jobRes, setJobRes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  async function sendRequest() {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/usr/src/app/job_file.py' })
    };
    const response = await fetch('/submit', requestOptions);
    const data = await response.json();
    setJobRes(data.data);
    setJobID(data.id);
    setIsLoading(false);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='py-5'>
        <AddSource className='my-2' boxes={boxes} setBoxes={setBoxes} />
        <button className="group my-2 rounded-lg border border-neutral-700 bg-neutral-800/30 px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-700" onClick={sendRequest}>Test Request</button>
      </div>
      <div className='py-5'>
        {isLoading ? 
          <CircularProgress /> 
          : (jobID != -1) ? <div>
              <p>Job ID: {jobID}</p>
                <br/>
              <p>Job Result: {jobRes}</p>
            </div> : <div />
        }
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <DndProvider backend={HTML5Backend}>
          <Canvas boxes={boxes} setBoxes={setBoxes} />
        </DndProvider>
      </div>
    </main>
  )
}