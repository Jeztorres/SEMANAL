# FinanzApp - Gestión Semanal de Finanzas Personales

Una aplicación web moderna y responsiva para gestionar tus finanzas semanales de manera efectiva. Diseñada con colores azul rey y completamente adaptable a cualquier dispositivo.

## 🌟 Características Principales

- **Diseño Moderno**: Interface moderna con tema azul rey y degradados elegantes
- **Totalmente Responsivo**: Optimizada para desktop, tablet y móvil
- **Gestión Semanal**: Enfoque en semanas laborales (Lunes a Viernes)
- **Sistema de Reportes**: Reportes automáticos disponibles los viernes después de 1:00 PM
- **Almacenamiento Local**: Todos los datos se guardan en tu navegador
- **Historial Completo**: Acceso a reportes de semanas anteriores

## 📱 Funcionalidades

### 📈 Registro de Ingresos
- Añade tus ingresos semanales con descripción
- Selección de días específicos (Lunes a Viernes)
- Cálculo automático de totales
- Historial detallado con fechas

### 💰 Gestión de Gastos
- Registra en qué y cuánto gastaste
- Categorización por días de la semana
- Descripción detallada de cada gasto
- Seguimiento de patrones de gasto

### 📊 Reportes Semanales
- **Disponibilidad Especial**: Solo los viernes después de 1:00 PM
- Resumen completo de ingresos vs gastos
- Cálculo automático del balance
- Comentarios personalizados
- Guardado automático en historial

### 📈 Historial y Análisis
- Acceso a todos los reportes anteriores
- Comparación entre semanas
- Tendencias de ingresos y gastos
- Comentarios guardados por semana

## 🚀 Cómo Usar

### Instalación
1. Descarga todos los archivos de la aplicación
2. Abre `index.html` en tu navegador web
3. ¡Listo! La aplicación funcionará sin necesidad de internet

### Navegación
- **Pestaña Ingresos**: Registra todo el dinero que recibes
- **Pestaña Gastos**: Anota en qué te gastas tu dinero
- **Pestaña Reporte**: Disponible solo viernes después de 1 PM

### Registrar Ingresos
1. Ve a la pestaña "Ingresos"
2. Ingresa la cantidad recibida
3. Agrega una descripción (opcional)
4. Selecciona el día de la semana
5. Haz clic en "Registrar Ingreso"

### Registrar Gastos
1. Ve a la pestaña "Gastos"
2. Ingresa la cantidad gastada
3. Describe en qué se gastó (obligatorio)
4. Selecciona el día de la semana
5. Haz clic en "Registrar Gasto"

### Generar Reporte Semanal
1. Ve a la pestaña "Reporte" (disponible viernes después de 1 PM)
2. Revisa el resumen automático
3. Agrega comentarios sobre la semana (opcional)
4. Haz clic en "Finalizar Semana y Guardar Reporte"

## 💡 Características Técnicas

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica moderna
- **CSS3**: Diseño responsivo con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidad avanzada y gestión de estado
- **Font Awesome**: Iconografía moderna
- **LocalStorage**: Almacenamiento persistente

### Responsive Design
- **Desktop**: Layout completo con sidebar y múltiples columnas
- **Tablet**: Diseño adaptativo con navegación optimizada
- **Móvil**: Interface simplificada con navegación por tabs

### Paleta de Colores
- **Azul Rey Principal**: #1e3a8a
- **Azul Claro**: #3b82f6
- **Verde (Ingresos)**: #10b981
- **Rojo (Gastos)**: #ef4444
- **Grises**: Varios tonos para texto y borders

## 📅 Lógica Semanal

### Definición de Semana
- **Inicio**: Lunes 00:00
- **Fin**: Viernes 23:59
- **Días Válidos**: Solo días laborales

### Sistema de Reportes
- **Habilitación**: Automática los viernes a las 13:00 (1:00 PM)
- **Restricción**: Un reporte por semana
- **Contenido**: Resumen completo + comentarios personales

### Contador de Tiempo
- Muestra tiempo restante hasta el próximo reporte
- Actualización en tiempo real
- Indicadores visuales de estado

## 🔧 Personalización

### Modificar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #1e3a8a; /* Cambia el azul rey principal */
    --primary-light: #3b82f6; /* Azul más claro */
    --success-color: #10b981; /* Verde para ingresos */
    --danger-color: #ef4444; /* Rojo para gastos */
}
```

### Cambiar Horario de Reportes
Modifica en `script.js` la función `canGenerateReport()`:
```javascript
return day === 5 && hour >= 13; // Viernes después de 1 PM
```

### Agregar Más Días
Para incluir fines de semana, modifica la función `populateDateSelectors()`.

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablets (iPad, Android)
- ✅ Smartphones (iOS, Android)

## 🔒 Privacidad y Datos

### Almacenamiento
- **Local**: Todos los datos se guardan en tu dispositivo
- **Sin Servidor**: No se envían datos a servidores externos
- **Privacidad Total**: Solo tú tienes acceso a tu información

### Backup Manual
Para hacer backup de tus datos:
1. Abre las herramientas de desarrollador (F12)
2. Ve a Storage > Local Storage
3. Busca 'finanzapp-data'
4. Copia el contenido

### Restaurar Datos
1. Abre las herramientas de desarrollador
2. Ve a Storage > Local Storage
3. Crea/edita 'finanzapp-data' con tu backup

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que el almacenamiento local esté habilitado
- Comprueba que no estés en modo incógnito
- Revisa que haya espacio suficiente en el dispositivo

### El reporte no se habilita
- Verifica que sea viernes después de la 1:00 PM
- Comprueba la zona horaria de tu dispositivo
- Asegúrate de que no hayas generado ya el reporte de la semana

### Problemas de visualización
- Actualiza el navegador a la última versión
- Limpia la caché del navegador
- Verifica que JavaScript esté habilitado

## 🔄 Actualizaciones Futuras

### Características Plannedadas
- [ ] Export de datos a Excel/PDF
- [ ] Gráficos y estadísticas avanzadas
- [ ] Categorías personalizables de gastos
- [ ] Metas de ahorro semanales
- [ ] Notificaciones push
- [ ] Modo oscuro automático

## 👨‍💻 Desarrollo

### Estructura del Proyecto
```
FinanzApp/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño responsivo
├── script.js           # Lógica de la aplicación
└── README.md          # Documentación
```

### Modificaciones
Para contribuir o modificar:
1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Implementa los cambios
4. Prueba en múltiples dispositivos
5. Envía un pull request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:
- Revisa la sección de solución de problemas
- Consulta la documentación técnica
- Contacta al desarrollador

---

**FinanzApp v1.0** - Desarrollado con ❤️ para una gestión financiera efectiva