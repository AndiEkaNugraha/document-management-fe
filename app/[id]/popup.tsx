"use client"
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function Popup({ idDocument, onSuccess }: { idDocument: string, onSuccess: () => void }) {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [version, setVersion] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [information, setInformation] = useState('')

  const openPopup = () => {
     setPopupVisible(true);
     setTimeout(() => {
        setShowPopup(true);
     }, 1);
  };

  const closePopup = () => {
     setShowPopup(false);
     setTimeout(() => {
        setPopupVisible(false);
     }, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
        setDocumentFile(e.target.files[0]);
     }
  };

  const send = async () => {
     if (!version || !documentFile) {
        alert("Please provide version and document.");
        return;
     }

     try {
        const formData = new FormData();
        formData.append('version', version);
        formData.append('file', documentFile);
        formData.append('created_by', user?.email ? user?.email : 'admin')
        formData.append('information',information)

        const response = await axios.post(
           `${process.env.NEXT_PUBLIC_API_URL}documents/${idDocument}/versions`,
           formData,
           {
              headers: {
                 'Content-Type': 'multipart/form-data',
              },
           }
        );

        console.log('Response:', response.data);
        alert('Document version added successfully');
        closePopup();

        // Panggil onSuccess untuk memberi tahu bahwa upload berhasil
        if (onSuccess) {
           onSuccess();
        }
     } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to add document version.');
     }
  };

   return (
      <>
         <button onClick={openPopup} className='text-sm font-medium bg-white border-2 border-black px-3 py-2 rounded-md flex items-center min-w-[170px] transition hover:bg-sky-600 hover:border-sky-600 hover:text-white active:text-white active:bg-sky-700 active:border-sky-700'>
         <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 11l0 6" /><path d="M9 14l6 0" /></svg>
            <p className='mx-auto'>Add Version</p>
         </button>

         {popupVisible && (
            <div className={`fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50  ${showPopup ? 'opacity-100' : 'opacity-0'} transition duration-300`}>
               <div className={`absolute translate-y-[20vh] bg-white p-6 rounded-lg shadow-lg min-w-[400px] mx-4 ${showPopup ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'} transition duration-300`}>
                  <button onClick={closePopup} className="absolute top-3 right-4 text-gray-600 hover:text-gray-900">x</button>
                  <h2 className="text-xl font-semibold mb-4 text-center">Add Version</h2>
                  <div className='grid gap-4 md:mt-9 mt-5'>
                     <div>
                        <p className='mb-2 font-medium'>Version</p>
                        <input className='w-full border py-2 px-4 outline-none shadow'
                           type="text" 
                           value={version} 
                           onChange={(e) => setVersion(e.target.value)} 
                           placeholder="Enter version" 
                        />
                        <small>example: V2.1</small>
                     </div>
                     <div>
                        <p className='mb-2 font-medium'>Information</p>
                        <input className='w-full border py-2 px-4 outline-none shadow'
                           type="text" 
                           value={information} 
                           onChange={(e) => setInformation(e.target.value)} 
                           placeholder="Information" 
                        />
                     </div>
                     <div>
                        <p className='mb-2 font-medium'>Document</p>
                        <div className='py-2 px-4 border shadow grid justify-center'><input accept="application/pdf" type="file" onChange={handleFileChange} /></div>
                        <small>Type: PDF</small>
                     </div>
                     <button onClick={send} className='bg-sky-600 rounded-sm py-1 px-3 text-white'>
                        Send
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
