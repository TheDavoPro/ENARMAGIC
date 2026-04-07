"""
EXTRACTOR DE RESIDUOS
======================
Recorre todas las subcarpetas de la carpeta donde esta este script,
busca archivos PNG, JPG, JPEG y TXT, los MUEVE a una carpeta llamada
"residuos" y dentro crea subcarpetas con el nombre de la carpeta origen.

Estructura resultante:
  Carpeta MADRE\
    residuos\
      Tema 1\          <- archivos que venian de "Tema 1\"
        imagen.jpg
        notas.txt
      Tema 2\          <- archivos que venian de "Tema 2\"
        portada.png
"""

import os
import sys
import re
import shutil
from pathlib import Path


# ─── Constantes ──────────────────────────────────────────────────────────────

EXTENSIONES_OBJETIVO = {'.png', '.jpg', '.jpeg', '.txt'}
NOMBRE_CARPETA_RESIDUOS = 'residuos'


# ─── Nombre seguro para carpeta ──────────────────────────────────────────────

def nombre_seguro(texto: str) -> str:
    """Elimina caracteres no permitidos en nombres de carpeta/archivo."""
    return re.sub(r'[<>:"/\\|?*]', '_', texto).strip()


# ─── Resolucion de conflictos de nombre ──────────────────────────────────────

def destino_sin_conflicto(carpeta_destino: Path, nombre_archivo: str) -> Path:
    """
    Si ya existe un archivo con ese nombre en destino, agrega un sufijo
    numerico: archivo_1.jpg, archivo_2.jpg, etc.
    """
    destino = carpeta_destino / nombre_archivo
    if not destino.exists():
        return destino

    stem = Path(nombre_archivo).stem
    suffix = Path(nombre_archivo).suffix
    contador = 1
    while destino.exists():
        destino = carpeta_destino / f"{stem}_{contador}{suffix}"
        contador += 1
    return destino


# ─── Proceso principal ───────────────────────────────────────────────────────

def extraer_residuos(raiz: Path):
    print("=" * 60)
    print("  EXTRACTOR DE RESIDUOS")
    print("=" * 60)
    print(f"  Carpeta raiz : {raiz}")

    carpeta_residuos = raiz / NOMBRE_CARPETA_RESIDUOS

    # Recopilar todas las subcarpetas, excluyendo la carpeta "residuos"
    subcarpetas = sorted(
        [
            d for d in raiz.rglob('*')
            if d.is_dir()
            and carpeta_residuos not in d.parents
            and d != carpeta_residuos
        ],
        key=lambda d: str(d).lower()
    )

    if not subcarpetas:
        print("\n[!] No se encontraron subcarpetas.")
        print("    Asegurate de colocar este script en la carpeta MADRE.")
        return

    print(f"  Subcarpetas  : {len(subcarpetas)}")
    print("-" * 60)

    total_movidos = 0
    total_sin_archivos = 0

    for carpeta in subcarpetas:
        # Buscar archivos objetivo directamente en esta carpeta (no recursivo)
        archivos = [
            f for f in carpeta.iterdir()
            if f.is_file() and f.suffix.lower() in EXTENSIONES_OBJETIVO
        ]

        if not archivos:
            total_sin_archivos += 1
            continue

        # Crear carpeta destino: residuos/<nombre_carpeta_origen>
        nombre_origen = nombre_seguro(carpeta.name)
        carpeta_destino = carpeta_residuos / nombre_origen
        carpeta_destino.mkdir(parents=True, exist_ok=True)

        print(f"\n  Carpeta origen : {carpeta.relative_to(raiz)}")
        print(f"  Destino        : residuos\\{nombre_origen}\\")
        print(f"  Archivos a mover: {len(archivos)}")

        movidos_en_carpeta = 0
        for archivo in sorted(archivos, key=lambda f: f.name.lower()):
            destino = destino_sin_conflicto(carpeta_destino, archivo.name)
            try:
                shutil.move(str(archivo), str(destino))
                print(f"    [MOVIDO] {archivo.name}"
                      + (f"  =>  {destino.name}" if destino.name != archivo.name else ""))
                movidos_en_carpeta += 1
                total_movidos += 1
            except Exception as e:
                print(f"    [ERROR] {archivo.name} : {e}")

        print(f"    => {movidos_en_carpeta} archivo(s) movido(s)")

    print()
    print("=" * 60)
    print("  RESUMEN")
    print(f"  Archivos movidos          : {total_movidos}")
    print(f"  Carpetas sin coincidencias: {total_sin_archivos}")
    if total_movidos > 0:
        print(f"  Ubicacion residuos        : {carpeta_residuos}")
    print("=" * 60)


# ─── Punto de entrada ────────────────────────────────────────────────────────

if __name__ == "__main__":
    raiz = Path(__file__).parent.resolve()
    extraer_residuos(raiz)
    print()
    input("Presiona Enter para cerrar...")
