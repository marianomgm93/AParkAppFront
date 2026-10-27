import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token de tu almacenamiento (ej. localStorage o un SessionStorage)
  const token = localStorage.getItem('jwt_token');

  // Si existe el token, clonar la petición y agregar la cabecera de Autorización
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Continuar con la petición modificada
    return next(authReq);
  }

  // Si no hay token (ej. al hacer login), la petición continúa intacta
  return next(req);
};