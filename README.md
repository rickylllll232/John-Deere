# API de Productos - John Deere 🚜

Esta es una API robusta construida con **Node.js** y **Express**, diseñada para la gestión de usuarios y productos con persistencia de datos en **MongoDB Atlas**.

## 🛠️ Requisitos Previos
Antes de ejecutar la aplicación, asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (Versión 14 o superior)
* Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Instrucciones de Ejecución (Localhost)

1. **Clonar el repositorio:**
   ```bash
   git clone [PEGA_AQUÍ_TU_LINK_DE_GITHUB]
   cd api-productos

2.   Instalar dependencias:

Bash
npm install

3. Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto y agrega tu cadena de conexión:

Fragmento de código
MONGO_URI=tu_cadena_de_conexion_de_mongodb
PORT=3000

4. niciar el servidor:

Bash
node server.js
El servidor iniciará en: http://localhost:3000

🔌 Endpoints Principales
POST /api/user/register - Registro de nuevos usuarios.

POST /api/productos - Registro de nuevos productos John Deere.
