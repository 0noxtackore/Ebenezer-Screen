"""
EBENEZER - Script de Instalación Automatizada
==============================================

Este script configura automáticamente todo el proyecto Ebenezer:
1. Instala dependencias de Python
2. Verifica el modelo de voz Vosk
3. Genera el índice de sermones
4. Descarga la biblioteca completa de mensajes

Uso: python setup.py
"""

import subprocess
import sys
import os
import json
import urllib.request
import zipfile
import shutil

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def print_step(step_num, total, text):
    print(f"[{step_num}/{total}] {text}...")

def run_command(cmd, description, shell=False):
    """Ejecuta un comando y maneja errores."""
    try:
        if isinstance(cmd, str) and not shell:
            # Si es string y no es shell, convertir a lista
            cmd = cmd.split()
        result = subprocess.run(cmd, check=True, capture_output=True, text=True, shell=shell)
        print(f"  ✓ {description}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Error en {description}")
        if e.stderr:
            print(f"    {e.stderr}")
        return False

def check_python_version():
    """Verifica que Python sea 3.7+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print("  ✗ Se requiere Python 3.7 o superior")
        print(f"    Versión actual: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"  ✓ Python {version.major}.{version.minor}.{version.micro} detectado")
    return True

def install_dependencies():
    """Instala las dependencias de Python."""
    print_step(1, 6, "Instalando dependencias de Python")
    
    dependencies = [
        "vosk",
        "websockets",
        "requests"
    ]
    
    for dep in dependencies:
        cmd = [sys.executable, "-m", "pip", "install", dep]
        if not run_command(cmd, f"Instalando {dep}"):
            return False
    
    return True

def download_vosk_model():
    """Descarga e instala el modelo de Vosk automáticamente."""
    print_step(2, 6, "Configurando modelo de voz Vosk")
    
    model_path = os.path.join("speaker", "model")
    
    # Verificar si ya existe
    if os.path.exists(model_path) and os.path.isdir(model_path):
        files = os.listdir(model_path)
        if len(files) > 0:
            print(f"  ✓ Modelo ya instalado en {model_path}")
            return True
    
    print(f"  ℹ Descargando modelo de voz (~ 40 MB)...")
    
    model_url = "https://alphacephei.com/vosk/models/vosk-model-small-es-0.42.zip"
    zip_path = "vosk-model.zip"
    extract_path = "speaker"
    
    try:
        # Descargar
        print(f"  ⏳ Descargando desde alphacephei.com...")
        urllib.request.urlretrieve(model_url, zip_path)
        print(f"  ✓ Descarga completada")
        
        # Extraer
        print(f"  ⏳ Extrayendo modelo...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
        
        # Renombrar carpeta extraída a "model"
        extracted_folder = os.path.join(extract_path, "vosk-model-small-es-0.42")
        if os.path.exists(extracted_folder):
            if os.path.exists(model_path):
                shutil.rmtree(model_path)
            os.rename(extracted_folder, model_path)
        
        # Limpiar archivo zip
        os.remove(zip_path)
        
        print(f"  ✓ Modelo instalado en {model_path}")
        return True
        
    except Exception as e:
        print(f"  ✗ Error al descargar modelo: {e}")
        print(f"  ℹ Descarga manual: https://alphacephei.com/vosk/models")
        print(f"  ℹ Extrae en: speaker/model/")
        return False

def generate_sermon_index():
    """Genera el índice completo de sermones."""
    print_step(3, 6, "Generando índice de sermones")
    
    script_path = os.path.join("messages", "fetch_all_sermons.py")
    
    if not os.path.exists(script_path):
        print(f"  ✗ Script no encontrado: {script_path}")
        return False
    
    try:
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            timeout=300  # 5 minutos máximo
        )
        
        if result.returncode == 0:
            # Verificar que se creó el índice
            index_path = os.path.join("messages", "sermon_index.json")
            if os.path.exists(index_path):
                with open(index_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    count = len(data)
                    print(f"  ✓ Índice generado con {count} sermones")
                    return True
        
        print(f"  ✗ Error al generar índice")
        print(f"    {result.stderr}")
        return False
        
    except subprocess.TimeoutExpired:
        print(f"  ✗ Timeout al generar índice (>5 min)")
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def download_sermon_library():
    """Descarga la biblioteca completa de sermones."""
    print_step(4, 6, "Descargando biblioteca de sermones")
    
    script_path = os.path.join("messages", "bulk_downloader.py")
    
    if not os.path.exists(script_path):
        print(f"  ✗ Script no encontrado: {script_path}")
        return False
    
    print(f"  ℹ Este proceso puede tomar varios minutos...")
    print(f"  ℹ Descargando ~416 sermones...")
    
    try:
        # Ejecutar en tiempo real para ver progreso
        process = subprocess.Popen(
            [sys.executable, script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Mostrar salida en tiempo real
        for line in process.stdout:
            if "Progreso:" in line or "Finalizado:" in line:
                print(f"    {line.strip()}")
        
        process.wait()
        
        if process.returncode == 0:
            # Verificar cuántos sermones se descargaron
            library_path = os.path.join("messages", "library")
            if os.path.exists(library_path):
                files = [f for f in os.listdir(library_path) if f.endswith('.json')]
                print(f"  ✓ Biblioteca descargada: {len(files)} sermones")
                return True
        
        print(f"  ✗ Error al descargar biblioteca")
        return False
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def verify_installation():
    """Verifica que todo esté correctamente instalado."""
    print_step(5, 6, "Verificando instalación")
    
    checks = []
    
    # Verificar ebenezer.py
    if os.path.exists("ebenezer.py"):
        print("  ✓ ebenezer.py encontrado")
        checks.append(True)
    else:
        print("  ✗ ebenezer.py no encontrado")
        checks.append(False)
    
    # Verificar índice de sermones
    index_path = os.path.join("messages", "sermon_index.json")
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"  ✓ Índice de sermones: {len(data)} entradas")
            checks.append(True)
    else:
        print("  ✗ Índice de sermones no encontrado")
        checks.append(False)
    
    # Verificar biblioteca
    library_path = os.path.join("messages", "library")
    if os.path.exists(library_path):
        files = [f for f in os.listdir(library_path) if f.endswith('.json')]
        print(f"  ✓ Biblioteca de sermones: {len(files)} archivos")
        checks.append(True)
    else:
        print("  ✗ Biblioteca de sermones no encontrada")
        checks.append(False)
    
    # Verificar Biblia (misma ruta que usa ebenezer.py / matcher)
    bible_path = os.path.join("bible", "Holy-bible", "bible.json")
    if os.path.exists(bible_path):
        print("  ✓ Biblia RV1960 encontrada")
        checks.append(True)
    else:
        print("  ✗ Biblia no encontrada (se esperaba bible/Holy-bible/bible.json)")
        checks.append(False)
    
    return all(checks)

def main():
    print_header("EBENEZER - INSTALACIÓN AUTOMATIZADA")
    
    # Verificar Python
    if not check_python_version():
        sys.exit(1)
    
    # Paso 1: Instalar dependencias
    if not install_dependencies():
        print("\n⚠ Error al instalar dependencias. Revisa los mensajes anteriores.")
        sys.exit(1)
    
    # Paso 2: Descargar modelo Vosk
    vosk_ok = download_vosk_model()
    
    # Paso 3: Generar índice de sermones
    if not generate_sermon_index():
        print("\n⚠ Error al generar índice de sermones.")
        print("  Puedes intentar ejecutar manualmente:")
        print("  python messages/fetch_all_sermons.py")
    
    # Paso 4: Descargar biblioteca
    if not download_sermon_library():
        print("\n⚠ Error al descargar biblioteca de sermones.")
        print("  Puedes intentar ejecutar manualmente:")
        print("  python messages/bulk_downloader.py")
    
    # Paso 5: Verificación final
    if verify_installation():
        print_header("✓ INSTALACIÓN COMPLETADA")
        print("Ebenezer está listo para usarse.\n")
        print("Para iniciar el sistema, ejecuta:")
        print("  python ebenezer.py\n")
        
        if not vosk_ok:
            print("⚠ El modelo de voz no se pudo descargar automáticamente.")
            print("  Descarga manual: https://alphacephei.com/vosk/models")
            print("  Extrae en: speaker/model/\n")
    else:
        print_header("⚠ INSTALACIÓN INCOMPLETA")
        print("Algunos componentes no se instalaron correctamente.")
        print("Revisa los mensajes anteriores para más detalles.\n")

if __name__ == "__main__":
    main()
