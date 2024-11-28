"use client"

import jwt from 'jsonwebtoken';
export interface DecodedToken {
   id: number,
   email: string,
   iat: number,
   exp: number
}
function decodeToken(token: string) {
   try {
      // Verifikasi token menggunakan kunci rahasia
      const decoded = jwt.decode(token); 
      return decoded as DecodedToken;
   } catch (error) {
      return error;
   }
}

export function Users () {
   const sessionData = sessionStorage.getItem('users');
   if (!sessionData || sessionData === "null") {
   window.location.href = 'https://my.prasmul-eli.co/login';
};
   if (sessionData) {
     const data = decodeToken(sessionData) as DecodedToken;
   //   if(data.exp < Date.now() / 1000) {
   //     window.location.href = 'https://my.prasmul-eli.co/login';
   //   }
     return data;
   }
   return null;
};
