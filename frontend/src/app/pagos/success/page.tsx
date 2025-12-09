"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

function PagoExitosoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    // Aquí podrías enviar una notificación de éxito o actualizar el estado local
    console.log('Pago exitoso:', { paymentId, status, externalReference });
  }, [paymentId, status, externalReference]);

  return (
    <Card className="text-center">
      <CardContent className="p-8">
        {/* Ícono de éxito */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación.
        </p>

        {paymentId && (
          <div className="p-4 bg-gray-50 rounded-lg mb-6 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">ID de pago:</span> {paymentId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/pagos')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
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

export default function PagoExitosoPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Suspense fallback={<LoadingFallback />}>
              <PagoExitosoContent />
            </Suspense>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
