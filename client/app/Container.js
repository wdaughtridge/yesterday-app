import update from 'immutability-helper'
import { useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { Box } from './Box.js'
import { ItemTypes } from './ItemTypes.js'
const styles = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
}
export const Container = ({
  boxes,
  setBoxes
}) => {
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      )
    },
    [boxes, setBoxes],
  )
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox],
  )
    return (
    boxes ?
      <div ref={drop} style={styles}>
        {Object.keys(boxes).map((key) => {
            const { left, top, title } = boxes[key]
            return (
              <Box
                key={key}
                id={key}
                left={left}
                top={top}
                boxes={boxes}
                setBoxes={setBoxes}
              >
                {title}
              </Box>
            )
          })
        }
      </div> 
      : null
  )
}
