"use client";

import React from "react";
import usePushNotifications from "@/hooks/usePushNotifications";

export default function PushToggle() {
  const { permission, token, error, requestPermissionAndRegister } =
    usePushNotifications();

  return (
    <div>
      <p>
        Permiso: <strong>{permission}</strong>
      </p>
      {token ? (
        <div>
          <p>Token obtenido</p>
          <small style={{ wordBreak: "break-all" }}>{token}</small>
        </div>
      ) : (
        <button
          onClick={() => requestPermissionAndRegister()}
          className="bg-[#FF6B35] text-white px-3 py-1 rounded"
        >
          Activar notificaciones
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
