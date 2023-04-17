import { useDrag } from 'react-dnd';
import { Popup } from 'reactjs-popup';
import { useState } from 'react';
import axios from 'axios';

// Local
import { ItemTypes } from './ItemTypes.js';

// Material UI
import { TextField, IconButton, Typography, CircularProgress, Tooltip, Accordion, AccordionSummary, AccordionDetails, Input } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const style = {
  position: 'absolute',
  cursor: 'move',
}

export const Box = ({ 
  id, 
  left, 
  top, 
  children, 
  boxes,
  setBoxes 
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top],
  );
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isDragging) {
    return <div ref={drag} />
  }

  const updateSourceTitle = (e) => {
    let updatedBoxes = {...boxes}
    updatedBoxes[id].title = e.target.value;
    setBoxes(updatedBoxes);
  }

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      axios.post('/spark/start_and_attach', {
        file: e.target.files[0]
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        console.log(res);
        if (res.status == 200) {
          const data = res.data;
          setJob({id: data.id, file: data.file});
        }
      });
    }
  }

  const killContainer = async () => {
    axios.post('/spark/stop', {
      id: job.id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      if (res.status == 200) {
        setJob(null);
      }
    });
  }

  const runJob = async () => {
    axios.post('/spark/run', {
      id: job.id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return (
    <div
      ref={drag}
      style={{ ...style, left, top }}
      data-testid="box"
      className="bg-neutral-900 rounded-lg border border-neutral-700 flex"
    >
      <Popup
        trigger={<button className="py-4 px-4">{boxes[id].title}</button>}
        modal
        nested
      >
        {close => (
          <div className="container flex flex-col justify-start justify-items-start space-y-4 py-8 bg-neutral-900 rounded-lg border border-neutral-700 w-screen">
            <div className="flex justify-between">
              <IconButton
                size="medium"
                color="inherit"
                aria-label="menu"
                onClick={close}
              >
                <CloseIcon />
              </IconButton>
              {job &&
                <div>
                  <IconButton
                    size="medium"
                    color="inherit"
                    aria-label="stop"
                    onClick={killContainer}
                  >
                    <Tooltip placement="right" title="Stop Spark cluster.">
                      <StopCircleIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    size="medium"
                    color="inherit"
                    aria-label="run"
                    onClick={runJob}
                  >
                    <Tooltip placement="right" title="Run job on Spark cluster.">
                      <PlayCircleIcon />
                    </Tooltip>
                  </IconButton>
                </div>
              }
            </div>
            <div>
                <TextField fullWidth={true} variant="filled" label="Name" value={boxes[id].title} onChange={updateSourceTitle} />
            </div>
            {!job &&
              <div>
                <label>
                  <Input type="file" onChange={handleChange} />
                </label>
              </div>
            }
            {job && 
              <div className="max-w-full">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Metadata</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {JSON.stringify(job)}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            }
          </div>
        )}
      </Popup>
    </div>
  );
}