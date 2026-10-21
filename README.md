# Sistema Experto de Diagnóstico Automotriz en Prolog

Este proyecto implementa un sistema experto mediante programación lógica utilizando Prolog, evaluando síntomas para determinar causas y proporcionar recomendaciones automotrices. 

## Arquitectura del Proyecto
1. **Frontend**: HTML, CSS, y Vanilla JavaScript.
2. **API Intermedia**: Node.js y Express. Se encarga de la comunicación HTTP y serialización JSON.
3. **Motor de Inferencia**: SWI-Prolog (`experto.pl`). Ejecuta las reglas, unificaciones y procesos de backtracking.

## Instalación y Ejecución Local
1. Asegúrate de tener instalado [Node.js](https://nodejs.org/) y [SWI-Prolog](https://www.swi-prolog.org/).
2. Clona este repositorio: `git clone <URL_DEL_REPOSITORIO>`
3. Instala las dependencias: `npm install`
4. Ejecuta el servidor: `npm start`
5. Abre en tu navegador web: `http://localhost:3000`

## Procedimiento de Despliegue con Docker
El proyecto incluye un `Dockerfile` que empaqueta conjuntamente Node.js y SWI-Prolog para publicarlo de manera predecible.
1. Construir la imagen: `docker build -t sistema-experto-prolog .`
2. Ejecutar contenedor localmente: `docker run -p 3000:3000 sistema-experto-prolog`
3. Para publicarlo en plataformas como Render o Railway, vincula tu repositorio de GitHub directamente al proveedor configurando el tipo de despliegue como "Docker".

## Ejemplo de Consulta Local al Motor Lógico
Si deseas probar la lógica directamente sin la interfaz:
```bash
swipl -q -f experto.pl -g "api_diagnosticar([chirrido_frenos, volante_vibra]), halt."