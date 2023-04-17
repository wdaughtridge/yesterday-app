'use client';

import { Container } from './Container.js';

export const Canvas = ({
    boxes,
    setBoxes
}) => {
    return (
        <div>
            <Container boxes={boxes} setBoxes={setBoxes} />
        </div>
    );
}