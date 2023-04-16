import { useDrag } from 'react-dnd'
import { ItemTypes } from './ItemTypes.js'
import { Popup } from 'reactjs-popup'
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
  if (isDragging) {
    return <div ref={drag} />
  }
  const updateSourceTitle = (e) => {
    let updatedBoxes = {...boxes}
    updatedBoxes[id].title = e.target.value.trim()
    setBoxes(updatedBoxes)
  }
  let cssTransparent = "group rounded-lg border border-neutral-700 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
  let css = "group rounded-lg border border-neutral-700 px-5 py-5 mx-5 my-5 bg-black"
  let modalButtons = "group rounded-lg px-3 py-1 bg-gray-700"
  let modalText = "px-3 py-1"
  return (
  <div
    ref={drag}
    style={{ ...style, left, top }}
    data-testid="box"
  >
    <Popup
      trigger={<button className={cssTransparent}> {boxes[id].title} </button>}
      modal
      nested
    >
      {close => (
        <div className={css}>
          <button className={modalButtons} onClick={close}>
            &times;
          </button>
          <div className={modalText}> <b>{boxes[id].title}</b> </div>
          <div className={modalText}>
            Source Configuration:
            <br />
            <label>
              Alias: <input className="bg-gray-800" value={boxes[id].title} onChange={updateSourceTitle} />
            </label>
          </div>
        </div>
      )}
    </Popup>
  </div>
  )
}