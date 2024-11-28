"use client";

import * as React from 'react';
import Navbar from "@/components/navbar";
import { useAuth } from '@/context/AuthContext';
import { Users, DecodedToken } from '@/utils/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from './popup'
import { useRouter } from "next/navigation";
import PdfViewerComponent from '@/components/pdfViewer';


export default function DetailDocument({ params: { id } }: { params: { id: string } }) {
   const router = useRouter()
   const { user,setUser } = useAuth();
   const [dataDocument, setDataDocument] = useState<string[]>([]); 
   const [versions, setVersions] = useState([]);
   const [documentType, setDocumentType] = useState('')
   const [documentTitle, setDocumentTitle] = useState('')
   const [department, setDepartment] = useState('')
   const [information, setInformation]= useState('')

   const getDocumentVersion = async (documentId: string) => {
      try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/versions`);
         setDocumentType(response.data.document_type)
         setDocumentTitle(response.data.document_title)
         setDepartment(response.data.department)
         setInformation(response.data.information)
         setDataDocument(response.data);
         setVersions(response.data.versions);
         console.log(response.data);
      } catch (e) {
         console.error(e); 
      }
   };

   const updateDocument = async () => {
      try {
         const data = {
            "document_title": documentTitle,
            "document_type": documentType,
            "department": department,
            "information": information,
            "updated_by": user?.email
          };
          console.log(data)
         const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}documents/${id}`, data);
         console.log(response.data);
      } catch (e) {
         console.error(e); 
      }
   }

   const deleteVersion = async (versionId:string) => {
      try{
         const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}documents/${id}/versions/${versionId}`)
         getDocumentVersion(id)
      }
      catch(e){
         console.log(e)
      }
   }

   const deleteDocument = async () => {
      try{
         const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}documents/${id}`)
         router.push("/")
      }catch(e){
         console.log(e)
      }
   }

   useEffect(() => {
      getDocumentVersion(id);
      const data = Users() as DecodedToken;
      setUser(data);
   }, [id, setUser]);  

   const handlePopupSuccess = () => {
      getDocumentVersion(id); 
   };
   

   return (
      <div className="bg-gray-50 min-h-screen pb-9">
         <div className="shadow bg-white w-full">
            <Navbar logo="logo-eli.svg" color="black" />
         </div>
         <div className="font-medium w-max-container mx-auto py-9 px-6 mt-16 bg-white rounded-xl shadow border grid">
            <h1 className="font-semibold text-xl text-sky-600">Detail Document</h1>
            <div className="text-sm grid md:grid-rows-2 md:grid-flow-col gap-x-10 gap-y-5 mt-5">
               <div className="flex justify-between items-center">
                  <p className="min-w-[150px]">Document Name</p>
                  <input onBlur={updateDocument} onChange={(e)=> setDocumentTitle(e.target.value)} value={documentTitle} placeholder="Document Name" className="ml-4 flex-1 w-full outline-none border shadow py-1 px-3 rounded-sm" type="text" />
               </div>
               <div className="flex justify-between items-center">
                  <p className="min-w-[150px]">Document Type</p>
                  <input onBlur={updateDocument} onChange={(e)=> setDocumentType(e.target.value)} value={documentType} placeholder="Document Type" className="ml-4 flex-1 w-full outline-none border shadow py-1 px-3 rounded-sm" type="text" />
               </div>
               <div className="flex justify-between items-center">
                  <p className="min-w-[150px]">Department</p>
                  <input onBlur={updateDocument} onChange={(e)=> setDepartment(e.target.value)} value={department} placeholder="Department" className="ml-4 flex-1 w-full outline-none border shadow py-1 px-3 rounded-sm" type="text" />
               </div>
               <div className="flex justify-between items-center">
                  <p className="min-w-[150px]">Information</p>
                  <input onBlur={updateDocument} onChange={(e)=> setInformation(e.target.value)} value={information} placeholder="Information" className="ml-4 flex-1 w-full outline-none border shadow py-1 px-3 rounded-sm" />
               </div>
            </div>
            <div className="grid mt-5">
               <button onClick={deleteDocument} className="ms-auto bg-red-600 text-white flex items-center px-3 py-2 rounded-md transition hover:bg-red-700 focus:bg-red-800 ">
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7h16" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
                  <p className='ms-3 text-sm'>Remove Document</p>
               </button>
            </div>
 
         </div>
         <div className="w-max-container mx-auto p-9 mt-10 bg-white rounded-xl border shadow py-9 px-6">
            <div className="flex justify-between">
               <h1 className="font-semibold text-xl text-sky-600">History Update</h1>
               <Popup idDocument={id} onSuccess={handlePopupSuccess}/>
            </div>
            
            {versions.length > 0 ? (  // Menampilkan data jika ada
               <ul>
                  {versions.map((version, index) => (
                     <div key={index} className="grid items-center mt-5 border-t py-5">
                        <div className="md:flex grid items-center font-medium gap-5">
                           <div className='flex items-center'>
                              <div className="w-fit text-sm bg-sky-600 py-1 px-5 rounded-md text-white font-semibold">{version.version}</div>
                              <p className="ms-5">{version.created_by}</p>
                           </div>
                           
                           <button onClick={() => deleteVersion(version.id)} className=" ms-auto bg-red-600 text-white flex items-center px-3 py-2 rounded-md transition hover:bg-red-700 focus:bg-red-800 ">
                              <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7h16" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
                              <p className='ms-3 text-sm'>Remove Version</p>
                           </button>
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-600">Information:</p>
                        <p className="border py-2 px-4 shadow rounded-md mt-2 text-sm font-medium bg-gray-100 text-gray-600   ">{version.information}</p>
                        <PdfViewerComponent version={version}/>
                     </div>
                  ))}
               </ul>
            ) : (
               <p>No document versions available.</p>
            )}
         </div>
      </div>
   );
}
