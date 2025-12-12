import { MesEnum, MetodoPago, PlanPagoModel } from '@/lib/api/types/pagos';
import { Store } from '@tanstack/store';

/**
 * Estado de la UI de pagos
 */
interface PagosState {
  // Selección de plan
  planSeleccionado: PlanPagoModel | null;
  mesInicioSeleccionado: MesEnum | null;
  cuotasDeseadas: number;
  
  // Inscripción actual (para gestionar pagos)
  inscripcionActual: number | null;
  
  // Selección de cuotas para pagar
  cuotasSeleccionadas: number[];
  
  // Modales
  isInscripcionModalOpen: boolean;
  isPagoModalOpen: boolean;
  isDetalleModalOpen: boolean;
  
  // Método de pago preferido
  metodoPago: MetodoPago;
  
  // Vista actual
  vistaActual: 'planes' | 'cuotas' | 'historial';
}

const initialState: PagosState = {
  planSeleccionado: null,
  mesInicioSeleccionado: null,
  cuotasDeseadas: 6,
  inscripcionActual: null,
  cuotasSeleccionadas: [],
  isInscripcionModalOpen: false,
  isPagoModalOpen: false,
  isDetalleModalOpen: false,
  metodoPago: 'MERCADOPAGO',
  vistaActual: 'planes',
};

export const pagosStore = new Store<PagosState>(initialState);

export const pagosActions = {
  // Selección de plan
  seleccionarPlan: (plan: PlanPagoModel | null) => {
    pagosStore.setState((state) => ({
      ...state,
      planSeleccionado: plan,
      mesInicioSeleccionado: plan ? plan.mesInicio : null,
      cuotasDeseadas: plan ? Math.min(6, plan.maxCuotas) : 6,
    }));
  },

  setMesInicio: (mes: MesEnum) => {
    pagosStore.setState((state) => ({
      ...state,
      mesInicioSeleccionado: mes,
    }));
  },

  setCuotasDeseadas: (cantidad: number) => {
    pagosStore.setState((state) => ({
      ...state,
      cuotasDeseadas: cantidad,
    }));
  },

  // Inscripción
  setInscripcionActual: (id: number | null) => {
    pagosStore.setState((state) => ({
      ...state,
      inscripcionActual: id,
      cuotasSeleccionadas: [],
    }));
  },

  // Selección de cuotas
  toggleCuotaSeleccionada: (cuotaId: number) => {
    pagosStore.setState((state) => {
      const yaSeleccionada = state.cuotasSeleccionadas.includes(cuotaId);
      return {
        ...state,
        cuotasSeleccionadas: yaSeleccionada
          ? state.cuotasSeleccionadas.filter((id) => id !== cuotaId)
          : [...state.cuotasSeleccionadas, cuotaId],
      };
    });
  },

  seleccionarTodasLasCuotas: (cuotaIds: number[]) => {
    pagosStore.setState((state) => ({
      ...state,
      cuotasSeleccionadas: cuotaIds,
    }));
  },

  limpiarSeleccion: () => {
    pagosStore.setState((state) => ({
      ...state,
      cuotasSeleccionadas: [],
    }));
  },

  // Método de pago
  setMetodoPago: (metodo: MetodoPago) => {
    pagosStore.setState((state) => ({
      ...state,
      metodoPago: metodo,
    }));
  },

  // Modales
  openInscripcionModal: (plan?: PlanPagoModel) => {
    pagosStore.setState((state) => ({
      ...state,
      isInscripcionModalOpen: true,
      planSeleccionado: plan || state.planSeleccionado,
    }));
  },

  closeInscripcionModal: () => {
    pagosStore.setState((state) => ({
      ...state,
      isInscripcionModalOpen: false,
    }));
  },

  openPagoModal: () => {
    pagosStore.setState((state) => ({
      ...state,
      isPagoModalOpen: true,
    }));
  },

  closePagoModal: () => {
    pagosStore.setState((state) => ({
      ...state,
      isPagoModalOpen: false,
    }));
  },

  openDetalleModal: () => {
    pagosStore.setState((state) => ({
      ...state,
      isDetalleModalOpen: true,
    }));
  },

  closeDetalleModal: () => {
    pagosStore.setState((state) => ({
      ...state,
      isDetalleModalOpen: false,
    }));
  },

  // Vistas
  setVistaActual: (vista: 'planes' | 'cuotas' | 'historial') => {
    pagosStore.setState((state) => ({
      ...state,
      vistaActual: vista,
    }));
  },

  // Reset
  reset: () => {
    pagosStore.setState(() => initialState);
  },
};
