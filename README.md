# Curso de Compiladores 2021 Segundo semestre 2021 - Equipo 03

[![View on GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aparedes1998/onescript)

- - -

- [Curso de Compiladores 2021 Segundo semestre 2021 - Equipo 03](#curso-de-compiladores-2021-segundo-semestre-2021---equipo-03)
  - [Introducción](#introducción)
  - [Features (v0.0.2)](#features-v002)
    - [Extras](#extras)
    - [Verificación](#verificación)
  - [Estructura de la solución](#estructura-de-la-solución)
  - [Instrucciones de uso](#instrucciones-de-uso)
    - [Ejecución de código fuente](#ejecución-de-código-fuente)
    - [Instalación como paquete npx](#instalación-como-paquete-npx)
  - [Enlaces de Interés](#enlaces-de-interés)
  - [Contribuidores](#contribuidores)

- - -

## Introducción

El presente repositorio contiene la implementación del paquete para NodeJS 14+ solicitado por la cátedra del curso Compiladores de la Universidad Católica del Uruguay el segundo semestre del año 2021, como proyecto final de curso.

La solución es un compilador que toma código fuente OneScript y lo transforma a su equivalente en Javascript (versión ES2020). La representación de código (o AST) que emplea se basa en la representación estándar de ECMAScript, llamada ESTree.

El programa principal se llamará ``1sc.js``, y puede llamarse usando la herramienta ``npx``.

## Features (v0.0.2)

El script por defecto toma el código fuente de la entrada estándar y escribirá el código generado en la salida estándar.

El script puede recibir los siguientes argumentos en la línea de comandos:

- ``-s <file>`` o ``--source <file>:`` Hace que el compilador tome el código fuente del archivo <file> en lugar
de la entrada estándar.
- ``-o <file>`` o ``--output <file>``: Hace que el compilador escriba el código generado en el archivo <file>
en lugar de la salida estándar.
- ``--log <file>:`` Hace que el compilador escriba una bitácora detallada del proceso de compilación en el archivo <file>. Esto se puede implementar con Winston.

### Extras

Quedan como tareas opcionales de este trabajo:

1. Agregar al compilador el argumento --minify para habilitar la minimización de código. De estar presente, el resultado de la generación de código debe minimizarse usando Terser.
2. Agregar al compilador el argumento --ast <file> para escribir a un archivo el AST obtenido del parser al archivo dado. Si la llamada al compilador tiene --ast y no tiene --output, la generación de código debe omitirse.

### Verificación

El proyecto incluye incluir casos de prueba con una cobertura de al menos 80%, utilizando la herramienta Jest.

Además de pruebas unitarias, incluye pruebas end-to-end para cada uno de los requerimientos.

## Estructura de la solución

```
onescript/                                  # Carpeta Raíz
├── src/                                    # Código Fuente
|   ├── parser/                             # Código relacionado al Parser
|   |   ├── onescript.grammar               # Gramática
|   |   ├── parser.js                       # Parser
|   |   ├── processors.js                   # Procesadores
|   |   └── tokens.js                       # Tokens
│   └── 1sc.js                              # Programa principal
├── test/                                   # Pruebas
|   └── parser.test.js                      # Pruebas del parser
├── LICENSE.md                              # Licencias
└── README.md                               # Documentación
```

## Instrucciones de uso

### Ejecución de código fuente

1. Clonar el repositorio
2. Posicionarse en la carpeta raíz con `cd <ruta_repositorio>`
3. Instalar dependencias con `npm i`
4. "Construir" el parser con `npm run build:parser`
5. Ejecutar el programa con `node src/1sc.js`

### Instalación como paquete npx

1. Clonar el repositorio
2. Posicionarse en la carpeta raíz con `cd <ruta_repositorio>`
3. Instalar paquete 1s con `npm i -g onescript` (puede requerir `sudo`)
4. Ejecutar el programa con `npx onescript`
5. Ejecutar pruebas con `<npx jest test>`

## Enlaces de Interés

- [Consigna](./COMPIL-Proyecto%202021.pdf)
- [ES2015](https://github.com/estree/estree/blob/master/es2015.md)
- [The ESTree Spec](https://github.com/estree/estree)
- [Javascript grammar](https://github.com/lezer-parser/javascript)
- [Lezer parser system](https://lezer.codemirror.net/)

## Contribuidores

- Agustín Paredes
- Francisco Piria
- Josefina R. Casanova