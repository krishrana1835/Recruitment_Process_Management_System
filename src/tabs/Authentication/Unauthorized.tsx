import { useNavigate } from 'react-router-dom';

export default function Unauthorized () {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      <button
        onClick={handleBackToLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
      >
        Back to Login
      </button>
    </div>
  );
};

