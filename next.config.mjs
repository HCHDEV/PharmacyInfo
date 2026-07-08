/** @type {import('next').NextConfig} */
const nextConfig = {
     output: 'export',  // <--- ตรวจสอบบรรทัดนี้ ต้องไม่มีพิมพ์ผิด
   images: {
     unoptimized: true,
   },
 };
 
 export default nextConfig;