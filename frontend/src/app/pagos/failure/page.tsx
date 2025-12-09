"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

function PagoFallidoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const status = searchParams.get('status');
  const statusDetail = searchParams.get('status_detail');

  return (
    <Card className="text-center">
      <CardContent className="p-8">
        {/* Ícono de error */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-5xl">❌</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pago no procesado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Hubo un problema al procesar tu pago. Por favor, intenta nuevamente o usa otro medio de pago.
        </p>

        {(status || statusDetail) && (
          <div className="p-4 bg-red-50 rounded-lg mb-6 text-sm text-left">
            {status && (
              <p className="text-red-700">
                <span className="font-medium">Estado:</span> {status}
              </p>
            )}
            {statusDetail && (
              <p className="text-red-600">
                <span className="font-medium">Detalle:</span> {statusDetail}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/pagos')}
            className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
          >
            Reintentar pago
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Ir al inicio
          </Button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Si el problema persiste, contacta a soporte.
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <Card className="text-center">
      <CardContent className="p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-5xl">⏳</span>
        </div>
        <p className="text-gray-600">Cargando...</p>
      </CardContent>
    </Card>
  );
}

export default function PagoFallidoPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Suspense fallback={<LoadingFallback />}>
              <PagoFallidoContent />
            </Suspense>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
