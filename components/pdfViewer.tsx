import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useState } from 'react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewerComponent = ({ version }) => {
    // State untuk mengontrol apakah komponen PDF Viewer terlihat atau tidak
    const [isVisible, setIsVisible] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    // Fungsi untuk toggle visibilitas
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className='grid border mt-5 rounded-lg'>
            <button 
                className='py-2 px-4 border-b text-sm justify-between font-semibold flex items-center hover:text-gray-400 transition'
                onClick={toggleVisibility} // Menambahkan handler click untuk toggle
            >
                <p>{isVisible ? 'Hide' : 'Show'}</p>
                <svg className={`ms-5 transition ${isVisible ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.3461 0.971094L4.2211 4.09609C4.19207 4.12515 4.15761 4.1482 4.11967 4.16393C4.08173 4.17965 4.04107 4.18775 4 4.18775C3.95893 4.18775 3.91827 4.17965 3.88033 4.16393C3.8424 4.1482 3.80793 4.12515 3.77891 4.09609L0.653908 0.971094C0.610155 0.927389 0.580352 0.871685 0.568274 0.811033C0.556196 0.750382 0.562385 0.68751 0.586057 0.630378C0.60973 0.573246 0.649822 0.524422 0.701258 0.490087C0.752693 0.455753 0.81316 0.437451 0.875002 0.4375H7.125C7.18684 0.437451 7.24731 0.455753 7.29875 0.490087C7.35018 0.524422 7.39027 0.573246 7.41395 0.630378C7.43762 0.68751 7.44381 0.750382 7.43173 0.811033C7.41965 0.871685 7.38985 0.927389 7.3461 0.971094Z" fill="currentColor"/>
                </svg>
            </button>

            {/* Hanya tampilkan Worker jika isVisible bernilai true */}
            {isVisible && (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js">
                    <div className='w-full h-[90vh] mx-auto'>
                        <Viewer 
                            fileUrl={`${process.env.NEXT_PUBLIC_API_URL}uploads/${version.document_unique_name}` }
                            plugins={[defaultLayoutPluginInstance]} 
                            httpHeaders={{
                                'Access-Control-Allow-Origin': '*',
                            }}
                        />
                    </div>
                </Worker>
            )}
        </div>
    );
};

export default PdfViewerComponent;
