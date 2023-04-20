import { useDrag } from 'react-dnd';
import { Popup } from 'reactjs-popup';
import { useState } from 'react';
import axios from 'axios';

// Local
import { ItemTypes } from './ItemTypes.js';

// Material UI
import { TextField, IconButton, Divider, Typography, CircularProgress, Tooltip, Accordion, AccordionSummary, AccordionDetails, Input, Snackbar, Alert, Fade} from '@mui/material';
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
  const [container, setContainer] = useState(null);
  const [source, setSource] = useState(null);
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

  const toggleSnack = (msg="", sev="") => {
    setAlertMsg(msg);
    setSeverity(sev);
    setOpen(!open);
  }

  const updateJobArgv = (e) => {
    let updatedJob = job;
    updatedJob.argv = e.target.value;
    setArgv(e.target.value);
    setJob(updatedJob);
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
        if (res.status == 200) {
          const data = res.data;
          setJob(data.job);
          setContainer(data.container);
          toggleSnack("Job file attached to cluster", "success");
        } else {

        }
      });
    }
  }

  const loadSource = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      axios.post('/spark/load_source', {
        file: e.target.files[0],
        data: {job: job, container: container}
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.status == 200) {
          const data = res.data;
          setSource(data.dest);
          toggleSnack("Source data attached to cluster", "success");
        } else {

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
      if (res.status == 200) {
        setJob(null);
        setContainer(null);
        toggleSnack("Cluster has been stopped", "success");
      } else {

      }
    });
  }

  const runJob = async () => {
    axios.post('/spark/run', {
      id: job.id,
      argv: job.argv
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      toggleSnack("Job has been run on cluster", "success");
    });
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar onClose={handleClose} autoHideDuration={3000} anchorOrigin={{vertical: 'top',horizontal: 'center'}} open={open} >
        <Alert variant="filled" onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
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
            <Fade in={close}>
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
              {!job &&
                <Input type="file" onChange={handleChange} />
              }
              {job &&
              <Fade in={job}>
                <div className="max-w-full flex space-y-2 flex-col">
                  <TextField fullWidth={true} variant="filled" label="Arguments" value={argv} onChange={updateJobArgv} />
                  {!source &&
                    <Fade in={!source}>
                      <Input type="file" onChange={loadSource} />
                    </Fade>
                  }
                  {source &&
                    <Fade in={source}>
                      <Typography>
                        {source}
                      </Typography>
                    </Fade>
                  }
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
                          <Typography>{job.id}</Typography>
                          <Typography>{job.path}</Typography>
                        </div>
                        <Divider />
                        <div className="flex flex-col max-w-full">
                          <Typography variant="h6">Container: </Typography>
                          <Typography>{container.id}</Typography>
                          <Typography>{container.img}:{container.ver}</Typography>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </Fade>
              }
            </div>
            </Fade>
          )}
        </Popup>
      </div>
    </div>
  );
}