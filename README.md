# AParkAPP - Frontend 🚗🅿️

Bienvenido al repositorio frontend de **AParkAPP**, la plataforma integral diseñada para conectar a clientes que necesitan estacionamiento con cocheras que ofrecen espacios disponibles. 

Este proyecto está desarrollado en **Angular** y se conecta a nuestra API REST construida en Spring Boot.

## Propuesta de Valor

AParkAPP facilita la operación diaria de las cocheras y mejora la experiencia de los clientes mediante:
- **Descubrimiento:** Los clientes encuentran cocheras a través de *Ofertas*.
- **Reservas:** Gestión del ciclo completo de la estadía (Reserva → Check-in → Estadía → Check-out).
- **Operación:** Herramientas para que empleados y dueños administren lugares, tickets y control de vehículos.

## Stack Tecnológico

- **Framework:** Angular
- **Lenguaje:** TypeScript
- **Estilos:** (A definir, ej. SCSS / TailwindCSS)
- **Autenticación:** JWT (inyección mediante Interceptors)

## 📂 Arquitectura del Proyecto

El proyecto sigue una arquitectura **Feature-Driven** (basada en dominios funcionales) para escalar de manera incremental:

- `src/app/core/`: Lógica central, servicios de autenticación, guards y modelos globales.
- `src/app/shared/`: Componentes reutilizables de UI.
- `src/app/layouts/`: Vistas estructurales separadas por rol (`admin-layout`, `management-layout`, `client-layout`).
- `src/app/features/`: Módulos de negocio aislados (`auth`, `garages`, `offers`, `reservations`, `vehicles`, `tickets`).

## Roles del Sistema

La interfaz adapta su experiencia según el rol del usuario autenticado:
- **ADMIN:** Administración general de la plataforma.
- **OWNER:** Dueño de una o múltiples cocheras. Gestiona sus sucursales y publica ofertas.
- **EMPLOYEE:** Personal operativo. Gestiona reservas manuales, check-in/out y emisión de tickets.
- **CLIENT:** Usuario que busca ofertas, registra sus vehículos y realiza reservas.

## Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd aparkapp-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   ng serve
   ```
   Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Reglas de Negocio Clave
- **Las ofertas no siempre tienen un lugar asignado.** Depende de la modalidad de la cochera.
- **Los lugares (Parking Spots) son asignados por la cochera**, el cliente no los elige en la app.
- **El Ticket se genera al hacer el Check-in** y actúa como comprobante y control de duración.
- Actualmente, los pagos se realizan fuera de la plataforma; el sistema registra los montos para el control del saldo.