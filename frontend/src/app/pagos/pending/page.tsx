"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

function PagoPendienteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <Card className="text-center">
      <CardContent className="p-8">
        {/* Ícono de pendiente */}
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-5xl">⏳</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pago Pendiente
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Esto puede tardar unos minutos. 
          Te notificaremos cuando se complete.
        </p>

        {paymentId && (
          <div className="p-4 bg-yellow-50 rounded-lg mb-6 text-sm">
            <p className="text-yellow-700">
              <span className="font-medium">ID de pago:</span> {paymentId}
            </p>
            {status && (
              <p className="text-yellow-600 mt-1">
                <span className="font-medium">Estado:</span> {status}
              </p>
            )}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Si pagaste en efectivo (Pago Fácil, Rapipago, etc.), 
            el pago puede tardar hasta 2 horas hábiles en acreditarse.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/pagos')}
            className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
          >
            Ver mis cuotas
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Ir al inicio
          </Button>
        </div>
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

export default function PagoPendientePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Suspense fallback={<LoadingFallback />}>
              <PagoPendienteContent />
            </Suspense>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
