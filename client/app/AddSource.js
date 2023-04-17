import { Tooltip, IconButton } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const AddSource = ({
    boxes,
    setBoxes
}) => {
    function addSourceAction() {
        let nextKey = Object.keys(boxes).length ? parseInt(Object.keys(boxes).slice(-1)) + 1 : 1;
        let updatedBoxes = Object.assign({}, boxes, { [nextKey] : { top: 180, left: 20, title: 'New Source ' + nextKey } });
        setBoxes(updatedBoxes);
    }
    return (
        <div>
            <Tooltip placement="left" title="Create a source and submit a Spark job.">
                <IconButton size="large" color="primary" aria-label="delete" onClick={addSourceAction}><AddCircleOutlineIcon/></IconButton>
            </Tooltip>
        </div>
    );
}