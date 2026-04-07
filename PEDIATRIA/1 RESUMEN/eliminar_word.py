"""
ELIMINADOR DE ARCHIVOS WORD
============================
Elimina todos los archivos .doc y .docx de la carpeta actual
y todas sus subcarpetas.

Primero muestra una lista de lo que se va a eliminar
y pide confirmacion antes de proceder.
"""

import os
import sys
from pathlib import Path


EXTENSIONES = {'.doc', '.docx'}


def buscar_archivos_word(carpeta: Path) -> list[Path]:
    encontrados = []
    for ruta in sorted(carpeta.rglob('*')):
        if ruta.is_file() and ruta.suffix.lower() in EXTENSIONES:
            encontrados.append(ruta)
    return encontrados


def eliminar_archivos(carpeta: Path):
    print("=" * 55)
    print("  ELIMINADOR DE ARCHIVOS WORD (.doc / .docx)")
    print("=" * 55)
    print(f"  Carpeta raiz: {carpeta}\n")

    archivos = buscar_archivos_word(carpeta)

    if not archivos:
        print("[*] No se encontraron archivos .doc o .docx.")
        return

    print(f"[!] Se encontraron {len(archivos)} archivo(s) para eliminar:\n")
    for ruta in archivos:
        # Mostrar ruta relativa para mayor legibilidad
        try:
            relativa = ruta.relative_to(carpeta)
        except ValueError:
            relativa = ruta
        print(f"    {relativa}")

    print()
    respuesta = input("  ¿Confirmas la eliminacion? Escribe SI para continuar: ").strip()

    if respuesta.upper() != "SI":
        print("\n[*] Operacion cancelada. No se elimino ningun archivo.")
        return

    print()
    eliminados = 0
    errores = 0

    for ruta in archivos:
        try:
            ruta.unlink()
            print(f"  [OK] Eliminado: {ruta.name}")
            eliminados += 1
        except Exception as e:
            print(f"  [ERROR] No se pudo eliminar {ruta.name}: {e}")
            errores += 1

    print()
    print("=" * 55)
    print(f"  Eliminados : {eliminados} archivo(s)")
    if errores:
        print(f"  Con error  : {errores} archivo(s) (ver arriba)")
    print("=" * 55)


if __name__ == "__main__":
    carpeta_actual = Path(os.getcwd())
    eliminar_archivos(carpeta_actual)
    print()
    input("Presiona Enter para cerrar...")
