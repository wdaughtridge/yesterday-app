'use client';
import { Container } from './Container.js'
import props from 'prop-types'
export const Canvas = ({
    boxes,
    setBoxes
}) => {
    return (
        <div>
            <Container boxes={boxes} setBoxes={setBoxes} />
        </div>
    )
}