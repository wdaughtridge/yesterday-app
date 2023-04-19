import { useDrag } from 'react-dnd';
import { Popup } from 'reactjs-popup';
import { useState } from 'react';
import axios from 'axios';

// Local
import { ItemTypes } from './ItemTypes.js';

// Material UI
import { TextField, IconButton, Divider, Typography, CircularProgress, Tooltip, Accordion, AccordionSummary, AccordionDetails, Input, Snackbar, Alert, Slide, Backdrop} from '@mui/material';
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
  )
  
  const [job, setJob] = useState(null);
  const [argv, setArgv] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  if (isDragging) {
    return <div ref={drag} />
  }

  const updateSourceTitle = (e) => {
    let updatedBoxes = {...boxes};
    updatedBoxes[id].title = e.target.value;
    setBoxes(updatedBoxes);
  }

  const updateJobArgv = (e) => {
    let updatedJob = job;
    updatedJob.job.argv = e.target.value;
    setArgv(e.target.value);
    setJob(updatedJob);
  }

  const handleChange = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      axios.post('/spark/start_and_attach', {
        file: e.target.files[0]
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.status == 200) {
          const data = res.data;
          setJob(data);
          setAlertMsg("Job file attached to Spark instance.");
          setSeverity("success");
          setOpen(true);
        } else {
          setAlertMsg("There was an error in attaching the job file!");
          setSeverity("error");
          setOpen(true);
        }
        setIsLoading(false);
      });
    }
  }

  const killContainer = async () => {
    setIsLoading(true);
    axios.post('/spark/stop', {
      id: job.job.id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.status == 200) {
        setJob(null);
        setAlertMsg("Spark instance was shut down successfully.");
        setSeverity("success");
        setOpen(true);
      } else {
        setAlertMsg("There was an error in stopping the Spark instance!");
        setSeverity("error");
        setOpen(true);
      }
      setIsLoading(false);
    });
  }

  const runJob = async () => {
    setIsLoading(true);
    axios.post('/spark/run', {
      id: job.job.id,
      argv: job.job.argv
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      setIsLoading(false);
    });
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={close}
            onClick={close}
          >
          <div className="container flex flex-col justify-start justify-items-start space-y-4 py-8 bg-neutral-900 rounded-lg border border-neutral-700 w-screen">
              <Snackbar anchorOrigin={{vertical: 'top',horizontal: 'center'}} open={open} autoHideDuration={6000} TransitionComponent={(props) => {return <Slide {...props} direction="down" />;}} >
                <Alert variant="filled" onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                  {alertMsg}
                </Alert>
              </Snackbar>
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
                      Spark instance config
                    </Typography>
                  </div>
                </div>
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
              <Snackbar open={isLoading} TransitionComponent={(props) => {return <Slide {...props} direction="right" />;}} >
                <div className="flex space-x-2 bg-neutral-800 p-4 rounded-sm">
                  <div className="self-center">
                    <Typography>
                      Executing Spark instance task.
                    </Typography>
                  </div>
                  <CircularProgress />
                </div>
              </Snackbar>
              {!job &&
                <div>
                  <label>
                    <Input type="file" onChange={handleChange} />
                  </label>
                </div>
              }
              {job && 
                <div className="max-w-full">
                  <TextField fullWidth={true} variant="filled" label="Arguments" value={argv} onChange={updateJobArgv} sx={{pb: 4}}/>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Metadata</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="flex flex-col max-w-full justify-between">
                        <div className="flex flex-col max-w-full">
                          <Typography variant="h6">Job: </Typography>
                          <Typography>{job.job.id}</Typography>
                          <Typography>{job.job.path}</Typography>
                        </div>
                        <Divider />
                        <div className="flex flex-col max-w-full">
                          <Typography variant="h6">Container: </Typography>
                          <Typography>{job.container.id}</Typography>
                          <Typography>{job.container.img}:{job.container.ver}</Typography>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              }
            </div>
          </Backdrop>
        )}
      </Popup>
    </div>
  );
}