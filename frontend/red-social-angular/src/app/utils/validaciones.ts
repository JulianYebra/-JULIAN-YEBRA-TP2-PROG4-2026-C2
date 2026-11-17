export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const MENSAJE_PASSWORD_INVALIDA =
  'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';

export function esPasswordValida(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}
