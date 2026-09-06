// computeScore + validarRut + maskRut
import crypto from "crypto";

export function normalizeRut(rut: string): string {
  return rut.replace(/[.\-\s]/g, "").toUpperCase();
}

export function validarRut(rutCompleto: string): boolean {
  if (typeof rutCompleto !== "string") return false;

  const valor = rutCompleto.replace(/\./g, "").trim().toUpperCase();
  if (!/^0*(\d+)-([\dK])$/.test(valor)) return false;

  const [cuerpo, dv] = valor.split("-");
  if (cuerpo.length < 7) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = 1; i <= cuerpo.length; i++) {
    suma += multiplo * Number(cuerpo.charAt(cuerpo.length - i));
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvCalculado === dv;
}

export function maskRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, "");
  return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.XXX-X`;
}

export function computeScore(rut: string): number {
  const hash = crypto
    .createHash("sha256")
    .update(normalizeRut(rut))
    .digest("hex");
  return parseInt(hash.substring(0, 8), 16) % 101;
}
