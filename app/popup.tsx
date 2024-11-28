"use client"
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Popup() {
   const { user } = useAuth();
   const router = useRouter()
   const [showPopup, setShowPopup] = useState(false);
   const [popupVisible, setPopupVisible] = useState(false);
   const [documentType, setDocumentType] = useState('')
   const [documentTitle, setDocumentTitle] = useState('')
   const [department, setDepartment] = useState('')
   const [information, setInformation]= useState('')

   const openPopup = () => {
      setPopupVisible(true);
      setTimeout(() => {
        setShowPopup(true);
      }, 1); // Delay to match the popup in animation
    };
  
    const closePopup = () => {
      setShowPopup(false);
      setTimeout(() => {
        setPopupVisible(false);
      }, 500);
    };
    const send = async () => {
      const data = {
         "document_title": documentTitle,
         "document_type": documentType,
         "department": department,
         "information": information,
         "created_by": user?.email?user?.email:'admin'
      }
      try{
         const response = await axios.post (`${process.env.NEXT_PUBLIC_API_URL}documents`, data)
         const id = response.data.id
         router.push(`/${id}`)
      }catch(e){
         console.log(e)
      }
    }
   return(
      <>
      <button onClick={openPopup} className='py-1 px-5 bg-sky-600 rounded text-white font-medium text-sm transition hover:bg-sky-700 active:bg-sky-800'>
        Add Document
      </button>
      {popupVisible && (
        <div className={`fixed inset-0 flex justify-center  transition duration-300 top-0 left-0`}>
          <div className={`absolute translate-y-[10vh] bg-white p-6 rounded-lg shadow-lg min-w-[400px] mx-4 border ${showPopup ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'} transition duration-300`}>
            <button onClick={closePopup} className="absolute top-3 right-4 text-gray-600 hover:text-gray-900">x</button>
            <h2 className="text-xl font-semibold mb-4 text-center">Add Document</h2>
            <div className='grid gap-4 md:mt-9 mt-5 font-medium text-sm'>
              <div>
                <p>Document Title</p>
                <input className='w-full py-1 px-3 border outline-none shadow mt-1 rounded-md' 
                  type="text" 
                  value={documentTitle} 
                  onChange={(e) => setDocumentTitle(e.target.value)} 
                  placeholder="Enter Document Name" 
                />
              </div>
              <div>
                <p>Document Type</p>
                <input className='w-full py-1 px-3 border outline-none shadow mt-1 rounded-md' 
                  type="text" 
                  value={documentType} 
                  onChange={(e) => setDocumentType(e.target.value)} 
                  placeholder="Enter Document Type" 
                />
              </div>
              <div>
                <p>Document Department</p>
                <input className='w-full py-1 px-3 border outline-none shadow mt-1 rounded-md' 
                  type="text" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  placeholder="Enter Department" 
                />
              </div>
              <div>
                <p>Information</p>
                <textarea className='w-full py-1 px-3 border outline-none shadow mt-1 rounded-md' 
                  value={information} 
                  onChange={(e) => setInformation(e.target.value)} 
                  placeholder="Enter Document Information" 
                />
              </div>
              <button onClick={send} className='bg-sky-600 rounded-sm py-1 px-3 text-white'>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      </>
   )
}