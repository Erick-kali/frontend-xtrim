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

### Backend (Recomendado: Django)
- **Django 5.0+** - Framework web de Python
- **Django REST Framework** - API RESTful
- **PostgreSQL/MySQL** - Base de datos relacional
- **Django CORS Headers** - Manejo de CORS para frontend

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

3. **Configurar variables de entorno**
\`\`\`bash
# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
\`\`\`

4. **Ejecutar en modo desarrollo**
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

### Backend (Django)

#### Prerrequisitos
- Python 3.9+
- pip
- PostgreSQL o MySQL (opcional, SQLite para desarrollo)

#### Instalación del Backend

1. **Crear entorno virtual**
\`\`\`bash
python -m venv telcox_backend
source telcox_backend/bin/activate  # En Windows: telcox_backend\Scripts\activate
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
pip install django djangorestframework django-cors-headers psycopg2-binary 
python -m pip install python-decouple
opcional(python -m pip install django)
python -m pip install mysql-connector-python
python -m pip install mysqlclient
python -m pip install flask-cors
\`\`\`

3. **Crear proyecto Django**
\`\`\`bash
django-admin startproject xtrim
cd telcox_backend
python manage.py startapp customers
\`\`\`

4. **Configurar settings.py**
\`\`\`python
# settings.py
import os
from decouple import config

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'customers',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'telcox_backend.urls'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME', default='telcox'),
        'USER': config('DB_USER', default='root'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
    }
}

# Para desarrollo con SQLite (más fácil)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}
\`\`\`

5. **Crear modelos (ver database-structure.txt para código completo)**
\`\`\`python
# customers/models.py
from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    PLAN_CHOICES = [
        ('basic', 'Plan Básico'),
        ('premium', 'Plan Premium'),
        ('unlimited', 'Plan Ilimitado'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Activo'),
        ('inactive', 'Inactivo'),
        ('suspended', 'Suspendido'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    customer_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.customer_id}"

# Agregar más modelos según database-structure.txt
\`\`\`

6. **Crear y aplicar migraciones**
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

7. **Crear superusuario**
\`\`\`bash
python manage.py createsuperuser
\`\`\`

8. **Crear datos de prueba**
\`\`\`bash
python manage.py shell
\`\`\`

\`\`\`python
# En el shell de Django
from customers.models import *
from django.contrib.auth.models import User
from datetime import date, timedelta
import decimal

# Crear usuario
user = User.objects.create_user('testuser', 'test@example.com', 'password123')

# Crear cliente
customer = Customer.objects.create(
    user=user,
    customer_id='CUST001',
    name='Juan Pérez García',
    email='juan.perez@email.com',
    phone='+34 612 345 678',
    plan='premium',
    status='active'
)

# Crear consumo de datos
DataConsumption.objects.create(
    customer=customer,
    used_gb=8.5,
    total_gb=20.0,
    billing_cycle_start=date.today() - timedelta(days=15),
    billing_cycle_end=date.today() + timedelta(days=15)
)

# Crear consumo de minutos
MinutesConsumption.objects.create(
    customer=customer,
    used_minutes=450,
    total_minutes=1000,
    billing_cycle_start=date.today() - timedelta(days=15),
    billing_cycle_end=date.today() + timedelta(days=15)
)

# Crear consumo de SMS
SMSConsumption.objects.create(
    customer=customer,
    used_sms=85,
    total_sms=200,
    billing_cycle_start=date.today() - timedelta(days=15),
    billing_cycle_end=date.today() + timedelta(days=15)
)

# Crear facturación
Billing.objects.create(
    customer=customer,
    current_balance=decimal.Decimal('45.50'),
    last_payment=decimal.Decimal('39.99'),
    last_payment_date=date.today() - timedelta(days=10),
    next_bill_date=date.today() + timedelta(days=20),
    monthly_cost=decimal.Decimal('39.99')
)

# Crear servicios
services_data = [
    {'name': 'Datos Móviles', 'service_type': 'data', 'status': 'active', 'monthly_cost': '15.00'},
    {'name': 'Llamadas Ilimitadas', 'service_type': 'voice', 'status': 'active', 'monthly_cost': '20.00'},
    {'name': 'SMS', 'service_type': 'sms', 'status': 'active', 'monthly_cost': '5.00'},
    {'name': 'Roaming Internacional', 'service_type': 'roaming', 'status': 'inactive', 'monthly_cost': '10.00'},
]

for service_data in services_data:
    Service.objects.create(
        customer=customer,
        name=service_data['name'],
        service_type=service_data['service_type'],
        status=service_data['status'],
        monthly_cost=decimal.Decimal(service_data['monthly_cost']),
        activated_date=date.today() - timedelta(days=30)
    )
\`\`\`

9. **Ejecutar servidor Django**
\`\`\`bash
python manage.py runserver 8000
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
telcox-platform/
├── frontend/                     # Aplicación Next.js
│   ├── app/                      # App Router de Next.js
│   │   ├── api/                  # API Routes (Backend simulado)
│   │   ├── globals.css           # Estilos globales y animaciones
│   │   ├── layout.tsx            # Layout principal
│   │   └── page.tsx              # Dashboard principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes base (shadcn/ui)
│   │   ├── animated-counter.tsx  # Contador animado
│   │   ├── billing-card.tsx      # Tarjeta de facturación
│   │   ├── consumption-card.tsx  # Tarjeta de consumo
│   │   ├── error-boundary.tsx    # Manejo de errores
│   │   ├── loading-skeleton.tsx  # Skeleton de carga
│   │   ├── notification-toast.tsx # Notificaciones
│   │   └── services-card.tsx     # Tarjeta de servicios
│   ├── data/                     # Datos simulados (solo para desarrollo)
│   ├── lib/                      # Utilidades y API
│   └── README.md                 # Este archivo
├── backend/                      # Aplicación Django
│   ├── telcox_backend/           # Proyecto Django
│   ├── customers/                # App de clientes
│   │   ├── models.py             # Modelos de datos
│   │   ├── views.py              # Vistas de API
│   │   ├── serializers.py        # Serializadores
│   │   └── urls.py               # URLs de la app
│   ├── manage.py                 # Comando de Django
│   └── requirements.txt          # Dependencias Python
└── database-structure.txt        # Estructura completa de BD
\`\`\`

## 🔧 API Endpoints

### Obtener datos del cliente
\`\`\`http
GET /api/customers/{customer_id}/consumption_data/
\`\`\`

**Respuesta:**
\`\`\`json
{
  "customer": {
    "id": "CUST001",
    "name": "Juan Pérez García",
    "email": "juan.perez@email.com",
    "phone": "+34 612 345 678",
    "plan": "Plan Premium",
    "status": "active"
  },
  "consumption": {
    "data": {
      "used": 8.5,
      "total": 20.0,
      "percentage": 42.5
    },
    "minutes": {
      "used": 450,
      "total": 1000,
      "percentage": 45.0
    },
    "sms": {
      "used": 85,
      "total": 200,
      "percentage": 42.5
    }
  },
  "billing": {
    "currentBalance": 45.50,
    "lastPayment": 39.99,
    "lastPaymentDate": "2025-01-10",
    "nextBillDate": "2025-02-01",
    "monthlyCost": 39.99
  },
  "services": [
    {
      "id": 1,
      "name": "Datos Móviles",
      "type": "data",
      "status": "active",
      "monthlyCost": 15.00
    }
  ]
}
\`\`\`

### Actualizar consumo
\`\`\`http
POST /api/customers/{customer_id}/refresh_consumption/
\`\`\`

## 🎨 Características de Diseño

### Responsividad Mejorada
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Botones de mínimo 44px para dispositivos táctiles
- **Grid Adaptativo**: Layout que se reorganiza según el tamaño de pantalla

### Notificaciones Mejoradas
- **Posición Optimizada**: Ubicadas debajo del header fijo (top-20)
- **Z-index Correcto**: z-40 para aparecer sobre el contenido pero debajo del header
- **Animaciones Fluidas**: Slide-up con transiciones suaves

### Animaciones Avanzadas
\`\`\`css
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
/* ... hasta stagger-6 */
\`\`\`

## 🔄 Conectar Frontend con Backend Django

1. **Actualizar la URL de API en el frontend**
\`\`\`typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function getCustomerData(): Promise<CustomerData> {
  const response = await fetch(`${API_BASE_URL}/customers/CUST001/consumption_data/`)
  if (!response.ok) {
    throw new Error('Error al obtener datos del cliente')
  }
  return response.json()
}
\`\`\`

2. **Configurar CORS en Django**
\`\`\`python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://tu-dominio-frontend.vercel.app",
]
\`\`\`

3. **Ejecutar ambos servidores**
\`\`\`bash
# Terminal 1: Backend Django
cd backend
python manage.py runserver 8000

# Terminal 2: Frontend Next.js
cd frontend
npm run dev
\`\`\`

## 🚀 Despliegue en Producción

### Frontend (Vercel)
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel
# NEXT_PUBLIC_API_URL=https://tu-backend.herokuapp.com/api
\`\`\`

### Backend (Heroku/Railway/DigitalOcean)
\`\`\`bash
# Crear requirements.txt
pip freeze > requirements.txt

# Crear Procfile para Heroku
echo "web: gunicorn telcox_backend.wsgi" > Procfile

# Instalar gunicorn
pip install gunicorn

# Configurar settings para producción
\`\`\`

## 📊 Base de Datos

La estructura completa de la base de datos está disponible en `database-structure.txt`, incluyendo:

- **Modelos Django completos** con relaciones y validaciones
- **Scripts SQL** para crear tablas manualmente
- **Datos de prueba** para poblar la base de datos
- **API Views** con endpoints RESTful
- **Configuración CORS** para conectar con Next.js

## 🔧 Solución de Problemas

### Problemas Comunes

1. **Error de CORS**
   - Verificar configuración de `django-cors-headers`
   - Asegurar que la URL del frontend esté en `CORS_ALLOWED_ORIGINS`

2. **Error de conexión a BD**
   - Verificar credenciales en `settings.py`
   - Asegurar que PostgreSQL/MySQL esté ejecutándose

3. **Error 404 en API**
   - Verificar que las URLs estén configuradas correctamente
   - Comprobar que el servidor Django esté ejecutándose en el puerto 8000

4. **Notificaciones no se ven**
   - Las notificaciones ahora aparecen en `top-20` (debajo del header)
   - Verificar que no haya elementos con z-index superior

## 📱 Funcionalidades Implementadas

- ✅ **Dashboard Responsivo**: Adaptado a todos los dispositivos
- ✅ **Notificaciones Mejoradas**: Posicionadas correctamente debajo del header
- ✅ **Backend Django**: Estructura completa con modelos y API
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

**Desarrollado con ❤️ usando Next.js, React, Tailwind CSS y Django**
