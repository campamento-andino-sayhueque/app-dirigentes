/**
 * Servicio de Notificaciones
 * 
 * Gestiona los tokens de dispositivo para push notifications.
 */

import { apiClient } from './cas-client';
import { ApiResult } from './http-client';
import { TokenDispositivoRequest } from './types';

/**
 * Servicio de notificaciones
 */
export const notificacionesService = {
  /**
   * Registra un token de dispositivo para push notifications
   */
  async registerDeviceToken(token: string, platform?: string): Promise<ApiResult<void>> {
    const data: TokenDispositivoRequest = { token, platform };
    return apiClient.post('/api/notificaciones/registrar-dispositivo', data);
  },

  /**
   * Elimina un token de dispositivo (al hacer logout, por ejemplo)
   */
  async unregisterDeviceToken(token: string): Promise<ApiResult<void>> {
    return apiClient.delete(`/api/device-tokens?token=${encodeURIComponent(token)}`);
  },

  /**
   * Registra el token del dispositivo actual
   * Detecta automáticamente la plataforma
   */
  async registerCurrentDevice(token: string): Promise<ApiResult<void>> {
    const platform = detectPlatform();
    return this.registerDeviceToken(token, platform);
  }
};

/**
 * Detecta la plataforma del dispositivo actual
 */
function detectPlatform(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  if (/windows/.test(userAgent)) return 'windows';
  if (/mac/.test(userAgent)) return 'macos';
  if (/linux/.test(userAgent)) return 'linux';
  
  return 'web';
}
