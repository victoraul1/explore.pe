'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('¡Tu correo ha sido verificado exitosamente!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Error al verificar el correo');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verificando tu correo...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu correo electrónico.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Verificación exitosa!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ir a Iniciar Sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error de verificación
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                href="/register"
                className="block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Registrarse de nuevo
              </Link>
              <Link
                href="/"
                className="block text-gray-600 hover:text-gray-800"
              >
                Volver al inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cargando...
          </h2>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}