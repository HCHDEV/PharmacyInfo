import CircularProgress from '@mui/material/CircularProgress';
export default function Loading() {
  return (
    <>
<div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-600 bg-opacity-50">
  <span className="loading loading-bars text-error w-20 h-20"></span>
  <div className="text-4xl text-base-100 text-center mt-6">Loading...</div>
</div>
    </>
  );
}
