import React from 'react';

import classes from './App.module.css';

interface IImgDim {
    width: number;
    height: number;
}

interface IPointer {
    x: number;
    y: number;
}

const ZOOM_THRESHOLD = 0.05;
const DEFAULT_SCALE = 1;

const App: React.FC = () => {
    const imgContainerRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const imgOrigSizeRef = React.useRef<IImgDim>();

    const pointerRef = React.useRef<IPointer | null>(null);

    const [scale, setScale] = React.useState<number>(DEFAULT_SCALE);

    React.useEffect(() => {
        const container = imgContainerRef.current;
        const img = imgRef.current;

        if (container && img) {
            imgOrigSizeRef.current = {
                width: img.width,
                height: img.height,
            };

            container.style.maxWidth = `${img.width}px`;
            container.style.maxHeight = `${img.height}px`;
            container.style.minWidth = `${img.width}px`;
            container.style.minHeight = `${img.height}px`;

            img.style.width = `${img.width}px`;
            img.style.height = `${img.height}px`;
        }
    }, []);

    React.useEffect(() => {
        if (imgRef.current && imgOrigSizeRef.current) {
            const newWidth = imgOrigSizeRef.current.width * scale;
            const newHeight = imgOrigSizeRef.current.height * scale;
            imgRef.current.style.width = `${newWidth}px`;
            imgRef.current.style.height = `${newHeight}px`;
        }
    }, [scale]);

    const zoomIn = () => setScale(scale + ZOOM_THRESHOLD);
    const zoomOut = () => setScale(scale - ZOOM_THRESHOLD);
    const zoomOutToDefault = () => {
        if (scale === DEFAULT_SCALE) {
            return;
        }

        if (scale - ZOOM_THRESHOLD < DEFAULT_SCALE) {
            setScale(DEFAULT_SCALE);
            return;
        }

        zoomOut();
    };

    const handleOnWheel: React.WheelEventHandler<HTMLImageElement> = (
        event
    ) => {
        if (event.deltaY > 0) {
            zoomOutToDefault();
        } else {
            zoomIn();
        }
    };

    const handleOnMouseDown: React.MouseEventHandler<HTMLImageElement> = (
        event
    ) => {
        pointerRef.current = {
            x: event.clientX - imgRef.current!.offsetLeft,
            y: event.clientY - imgRef.current!.offsetTop,
        };
    };

    const handleOnMouseMove: React.MouseEventHandler<HTMLImageElement> = (
        event
    ) => {
        if (pointerRef.current) {
            imgRef.current!.style.left = `${
                event.clientX - pointerRef.current.x
            }px`;
            imgRef.current!.style.top = `${
                event.clientY - pointerRef.current.y
            }px`;
        }
    };

    const handleOnMouseUp: React.MouseEventHandler<HTMLImageElement> = () => {
        pointerRef.current = null;
    };

    return (
        <div
            ref={imgContainerRef}
            className={classes.container}
            onWheel={handleOnWheel}
            onMouseDown={handleOnMouseDown}
            onMouseMove={handleOnMouseMove}
            onMouseUp={handleOnMouseUp}
        >
            <img
                ref={imgRef}
                onDragStart={(event) => event.preventDefault()}
                src="https://www.thecarexpert.co.uk/wp-content/uploads/2014/05/damaged-opel-omega.jpg"
                alt=""
                className={classes.img}
            />
            <div className={classes.cropper} />
        </div>
    );
};

export default App;
