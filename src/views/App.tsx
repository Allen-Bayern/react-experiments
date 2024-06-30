import React from 'react';
import { Modal } from '@/components';

const { useState, useRef } = React;

function App() {
    const [isModalShow, setIsModalShow] = useState(false);

    const modalRef = useRef<HTMLDialogElement | null>(null);

    return (
        <>
            <button
                onClick={() => {
                    setIsModalShow(true);
                }}
            >
                Open Modal
            </button>
            <Modal
                visible={isModalShow}
                onClickShadow={() => {
                    setIsModalShow(false);
                }}
                ref={modalRef}
            >
                hello world
            </Modal>
        </>
    );
}

export default App;
