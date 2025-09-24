# 🚀 TelcoX - Plataforma de Autogestión de Telecomunicaciones

Una moderna plataforma web para la autogestión de servicios de telecomunicaciones, desarrollada como solución al reto técnico de TelcoX. La aplicación permite a los usuarios visualizar su consumo de datos, minutos y SMS en tiempo real, así como gestionar su información de facturación y servicios contratados.

## ✨ Características Principales

- **📊 Dashboard en Tiempo Real**: Visualización de consumo de datos, minutos y SMS
- **💰 Gestión de Facturación**: Consulta de saldo, próximas facturas y historial de pagos
- **🔧 Administración de Servicios**: Vista y gestión de servicios contratados
- **🎨 Interfaz Moderna**: Diseño responsive con tema oscuro y animaciones fluidas
- **⚡ Actualizaciones Automáticas**: Refresh automático cada 30 segundos
- **🔄 Manejo de Errores**: Sistema robusto de manejo de errores y reintentos
- **📱 Responsive Design**: Optimizado para dispositivos móviles y desktop
- **🔔 Notificaciones**: Sistema de notificaciones posicionadas correctamente

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework de React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Framework de estilos utilitarios
- **Shadcn/ui** - Componentes de interfaz de usuario
- **Lucide React** - Iconos modernos
- **Animaciones CSS** - Transiciones y efectos fluidos



## 🚀 Instalación y Configuración

### Frontend (Next.js)

#### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

#### Instalación

1. **Clonar o descargar el proyecto**
\`\`\`bash
# Si tienes el código en GitHub
git clone <repository-url>
cd telcox-platform

# O descargar el ZIP desde v0 y extraer
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
\`\`\`



3. **Ejecutar en modo desarrollo**
\`\`\`bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
\`\`\`

5. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 📱 Funcionalidades Implementadas

- ✅ **Dashboard Responsivo**: Adaptado a todos los dispositivos
- ✅ **Notificaciones Mejoradas**: Posicionadas correctamente debajo del header
- ✅ **Backend flask**: Estructura completa con modelos y API
- ✅ **Base de Datos**: Esquema completo para PostgreSQL/MySQL
- ✅ **Animaciones Fluidas**: Transiciones y efectos optimizados
- ✅ **Manejo de Errores**: Sistema robusto de error handling
- ✅ **Actualizaciones en Tiempo Real**: Refresh automático cada 30s
- ✅ **Touch Optimized**: Botones y elementos optimizados para móvil

## 📞 Soporte

Si encuentras algún problema:

1. **Frontend**: Revisa la consola del navegador para errores
2. **Backend**: Verifica los logs de Django con `python manage.py runserver --verbosity=2`
3. **Base de Datos**: Asegúrate de que las migraciones estén aplicadas
4. **CORS**: Verifica la configuración de CORS si hay problemas de conexión

## 📄 Licencia

Este proyecto fue desarrollado como solución al reto técnico de TelcoX y está disponible para uso educativo y de demostración.

---

**Desarrollado con ❤️ usando Next.js, React, Tailwind CSS y Flask**
