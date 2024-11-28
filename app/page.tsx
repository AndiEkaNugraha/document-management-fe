// app/example/page.js
'use client'; // Menandai komponen ini sebagai komponen klien
import { useEffect, useState } from 'react';
import { Users, DecodedToken } from '@/utils/auth';
import { useAuth } from '@/context/AuthContext';
import Navbar from "@/components/navbar";
import axios from 'axios';
import Popup from './popup';
import Link from 'next/link';

async function getDocument(page,search:string) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}documents-pagination?limit=10&page=${page}&search=${search}`);
  console.log(response.data);
  return response.data;
}

export default function Page() {
  const { setUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState('');

  const fetchData = async (page:number) => {
    setLoading(true);
    try {
      const data = await getDocument(page, search);
      console.log(data.data)
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
      setTotalData(data.total);
      setDocuments(data.data); // Simpan data ke state
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data dokumen saat komponen di-mount dan saat currentPage berubah
  useEffect(() => {
    fetchData(currentPage);
    const data = Users() as DecodedToken;
    setUser(data);
  }, [setUser, currentPage,search]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handlePageClick = (page:number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 h-[0px]">
      <div className='h-[276px] bg-[#26D07C] w-full z-0'>
        <Navbar logo="logo-eli-white.svg" color="white"/>
      </div>
      <div className='bg-white border shadow w-max-container mx-auto relative z-10 translate-y-[-150px] min-h-[calc(100vh-150px)] p-9 rounded-t-xl'>
        <div className='grid'>
          <h1 className='text-2xl font-semibold text-gray-600'>Documents Management</h1>
          <div className='flex gap-3 ms-auto self-end'>
            <div className='flex justify-between border items-center px-4 py-1 rounded shadow'>
            <input 
              onBlur={(e) => setSearch((e.currentTarget as HTMLInputElement).value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearch((e.currentTarget as HTMLInputElement).value); 
                }
              }} 
              className='min-w-[300px] outline-none' 
              type="text" 
              placeholder='Search' 
            />
            <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="none"  stroke="gray"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
            </div>
            <Popup/>
          </div>
        </div>

        {/* Tampilkan data dokumen */}
        <div className='mt-10 min-h-[460px]'>
          <table className='w-full'>
            <thead className='border-y'>
              <tr>
                <th className='py-3 font-medium text-gray-500'>No</th>
                <th className='py-3 font-medium text-gray-500'>Document Title</th>
                <th className='py-3 font-medium text-gray-500'>Document Type</th>
                <th className='py-3 font-medium text-gray-500'>Department</th>
                <th className='py-3 font-medium text-gray-500'>Version</th>
                <th className='py-3 font-medium text-gray-500'>View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="text-center py-10 bg-white text-gray-600" colSpan="6">Loading...</td>
                </tr>
              ) : documents.length > 0 ? (
                documents.map((doc, index) => (
                  <tr key={doc.id}>
                    <td className='py-[10px] text-center font-medium text-[14px]'>{(currentPage - 1) * 10 + index + 1}</td>
                    <td className='py-[10px] text-center font-medium text-[14px] border-l-2 border-white'>{doc.document_title}</td>
                    <td className='py-[10px] text-center font-medium text-[14px] border-l-2 border-white'>{doc.document_type}</td>
                    <td className='py-[10px] text-center font-medium text-[14px] border-l-2 border-white'>{doc.department}</td>
                    <td className='py-[10px] text-center font-medium text-[14px] border-l-2 border-white grid'>{doc.version && <div className='w-fit mx-auto bg-emerald-500 rounded-full py-1 px-4 text-white text-[12px] font-semibold'>{doc.version}</div>}</td>
                    <td className='py-[10px] text-center font-medium text-[14px] border-l-2 border-white'>
                      <Link href={`/${doc.id}`}><button className='btn py-[6px] px-[6px] rounded-full text-white font-medium text-sm align-middle hover:scale-110 hover:opacity-70 transition'>
                      </button></Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-10 bg-white text-gray-600" colSpan="6">No documents found</td>
                </tr>
              )}
            </tbody>
          </table>

          
        </div>
        {/* Pagination Controls */}
        <div className='flex mt-4 gap-5 justify-end font-medium text-sm'>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`py-2 px-4 ${currentPage === 1 ? 'text-gray-400' : ' text-gray-800'}`}
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <button onClick={() => handlePageClick(currentPage - 1)} className='py-2 px-3 bg-gray-200 rounded-xl'>
                  {currentPage - 1}
                </button>
              )}
              <button className='py-2 px-4 bg-sky-600 text-white rounded-xl'>{currentPage}</button>
              {currentPage < totalPages && (
                <button onClick={() => handlePageClick(currentPage + 1)} className='py-2 px-3 bg-gray-200 rounded-xl'>
                  {currentPage + 1}
                </button>
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-800'}`}
            >
              Next
            </button>
          </div>
      </div>
    </div>
  );
}
