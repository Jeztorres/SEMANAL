// Gestión de datos y estado de la aplicación
class FinanzApp {
    constructor() {
        this.currentWeek = this.getCurrentWeek();
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.updateWeekInfo();
        this.setupEventListeners();
        this.populateDateSelectors();
        this.updateTotals();
        this.updateReportStatus();
        this.loadTransactionLists();
        this.loadReportHistory();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Navegación por tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Formularios
        document.getElementById('ingresoForm').addEventListener('submit', (e) => this.handleIngresoSubmit(e));
        document.getElementById('gastoForm').addEventListener('submit', (e) => this.handleGastoSubmit(e));

        // Verificar estado del reporte cada minuto
        setInterval(() => this.updateReportStatus(), 60000);
    }

    // Obtener la semana actual (lunes a viernes)
    getCurrentWeek() {
        const now = new Date();
        const day = now.getDay();
        const monday = new Date(now);
        
        // Ajustar para que Monday = 0
        const daysFromMonday = day === 0 ? 6 : day - 1;
        monday.setDate(now.getDate() - daysFromMonday);
        monday.setHours(0, 0, 0, 0);

        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        friday.setHours(23, 59, 59, 999);

        return {
            start: monday,
            end: friday,
            key: this.getWeekKey(monday)
        };
    }

    getWeekKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Actualizar información de la semana en el header
    updateWeekInfo() {
        const weekDatesElement = document.getElementById('weekDates');
        const startDate = this.currentWeek.start.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
        const endDate = this.currentWeek.end.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
        weekDatesElement.textContent = `${startDate} - ${endDate}`;
    }

    // Cargar datos del localStorage
    loadData() {
        const savedData = localStorage.getItem('finanzapp-data');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            weeks: {},
            reportHistory: []
        };
    }

    // Guardar datos en localStorage
    saveData() {
        localStorage.setItem('finanzapp-data', JSON.stringify(this.data));
    }

    // Obtener datos de la semana actual
    getCurrentWeekData() {
        if (!this.data.weeks[this.currentWeek.key]) {
            this.data.weeks[this.currentWeek.key] = {
                ingresos: [],
                gastos: [],
                reportGenerated: false
            };
        }
        return this.data.weeks[this.currentWeek.key];
    }

    // Poblar selectores de fecha con días de lunes a viernes
    populateDateSelectors() {
        const selectors = ['fechaIngreso', 'fechaGasto'];
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        
        selectors.forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            selector.innerHTML = '<option value="">Seleccionar día</option>';
            
            days.forEach((day, index) => {
                const date = new Date(this.currentWeek.start);
                date.setDate(this.currentWeek.start.getDate() + index);
                
                const option = document.createElement('option');
                option.value = date.toISOString().split('T')[0];
                option.textContent = `${day} (${date.toLocaleDateString('es-ES')})`;
                selector.appendChild(option);
            });
        });
    }

    // Cambiar entre pestañas
    switchTab(tabName) {
        // Remover clase active de todos los botones y contenidos
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Activar pestaña seleccionada
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Actualizar estado del reporte si es necesario
        if (tabName === 'reporte') {
            this.updateReportStatus();
        }
    }

    // Manejar envío del formulario de ingreso
    handleIngresoSubmit(e) {
        e.preventDefault();
        
        const cantidad = parseFloat(document.getElementById('cantidad').value);
        const descripcion = document.getElementById('descripcionIngreso').value || 'Ingreso sin descripción';
        const fecha = document.getElementById('fechaIngreso').value;

        if (!cantidad || !fecha) {
            this.showMessage('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const ingreso = {
            id: Date.now(),
            cantidad,
            descripcion,
            fecha,
            timestamp: new Date().toISOString()
        };

        const weekData = this.getCurrentWeekData();
        weekData.ingresos.push(ingreso);
        this.saveData();

        // Limpiar formulario
        document.getElementById('ingresoForm').reset();
        
        this.updateTotals();
        this.loadTransactionLists();
        this.showMessage('Ingreso registrado exitosamente', 'success');
    }

    // Manejar envío del formulario de gasto
    handleGastoSubmit(e) {
        e.preventDefault();
        
        const cantidad = parseFloat(document.getElementById('cantidadGasto').value);
        const descripcion = document.getElementById('descripcionGasto').value;
        const fecha = document.getElementById('fechaGasto').value;

        if (!cantidad || !descripcion || !fecha) {
            this.showMessage('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const gasto = {
            id: Date.now(),
            cantidad,
            descripcion,
            fecha,
            timestamp: new Date().toISOString()
        };

        const weekData = this.getCurrentWeekData();
        weekData.gastos.push(gasto);
        this.saveData();

        // Limpiar formulario
        document.getElementById('gastoForm').reset();
        
        this.updateTotals();
        this.loadTransactionLists();
        this.showMessage('Gasto registrado exitosamente', 'success');
    }

    // Actualizar totales
    updateTotals() {
        const weekData = this.getCurrentWeekData();
        
        const totalIngresos = weekData.ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
        const totalGastos = weekData.gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);

        document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
        document.getElementById('totalGastos').textContent = totalGastos.toFixed(2);

        // Actualizar resumen en la pestaña de reporte
        document.getElementById('resumenIngresos').textContent = `$${totalIngresos.toFixed(2)}`;
        document.getElementById('resumenGastos').textContent = `$${totalGastos.toFixed(2)}`;
        
        const balance = totalIngresos - totalGastos;
        const balanceElement = document.getElementById('resumenBalance');
        balanceElement.textContent = `$${balance.toFixed(2)}`;
        balanceElement.style.color = balance >= 0 ? '#10b981' : '#ef4444';
    }

    // Cargar listas de transacciones
    loadTransactionLists() {
        const weekData = this.getCurrentWeekData();
        
        this.loadTransactionList('listaIngresos', weekData.ingresos, 'ingreso');
        this.loadTransactionList('listaGastos', weekData.gastos, 'gasto');
    }

    loadTransactionList(containerId, transactions, type) {
        const container = document.getElementById(containerId);
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-${type === 'ingreso' ? 'money-bill-wave' : 'shopping-cart'}"></i>
                    <h3>No hay ${type}s registrados</h3>
                    <p>Agrega tu primer ${type} de la semana</p>
                </div>
            `;
            return;
        }

        // Ordenar por fecha más reciente
        transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        container.innerHTML = transactions.map(transaction => {
            const date = new Date(transaction.fecha);
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const formattedDate = date.toLocaleDateString('es-ES');

            return `
                <div class="transaction-item slide-in">
                    <div class="transaction-info">
                        <div class="amount ${type === 'ingreso' ? 'income' : 'expense'}">
                            ${type === 'ingreso' ? '+' : '-'}$${transaction.cantidad.toFixed(2)}
                        </div>
                        <div class="description">${transaction.descripcion}</div>
                        <div class="date">${dayName}, ${formattedDate}</div>
                    </div>
                    <div class="transaction-actions">
                        <button class="btn-icon delete" onclick="app.deleteTransaction('${transaction.id}', '${type}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Eliminar transacción
    deleteTransaction(id, type) {
        this.showConfirmModal(
            `¿Estás seguro de que quieres eliminar este ${type}?`,
            () => {
                const weekData = this.getCurrentWeekData();
                const field = type === 'ingreso' ? 'ingresos' : 'gastos';
                
                weekData[field] = weekData[field].filter(item => item.id !== parseInt(id));
                this.saveData();
                
                this.updateTotals();
                this.loadTransactionLists();
                this.showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado`, 'success');
            }
        );
    }

    // Verificar si se puede generar reporte (viernes después de 1 PM)
    canGenerateReport() {
        const now = new Date();
        const day = now.getDay(); // 0 = domingo, 5 = viernes
        const hour = now.getHours();

        return day === 5 && hour >= 13; // Viernes después de 1 PM
    }

    // Actualizar estado del reporte
    updateReportStatus() {
        const reportTab = document.getElementById('reporteTab');
        const reporteBloqueado = document.getElementById('reporteBloqueado');
        const reporteActivo = document.getElementById('reporteActivo');
        const reporteInfo = document.getElementById('reporteInfo');

        if (this.canGenerateReport()) {
            reportTab.classList.remove('disabled');
            reporteBloqueado.style.display = 'none';
            reporteActivo.style.display = 'block';
            reporteInfo.textContent = 'Generar reporte semanal disponible';
            reporteInfo.style.color = '#10b981';
        } else {
            reportTab.classList.add('disabled');
            reporteBloqueado.style.display = 'block';
            reporteActivo.style.display = 'none';
            
            const now = new Date();
            const nextFriday = this.getNextFriday();
            const timeUntilReport = this.getTimeUntilReport(nextFriday);
            
            reporteInfo.textContent = `Reporte disponible en: ${timeUntilReport}`;
            reporteInfo.style.color = '#64748b';
        }

        // Verificar si ya se generó el reporte de esta semana
        const weekData = this.getCurrentWeekData();
        if (weekData.reportGenerated && this.canGenerateReport()) {
            reporteInfo.textContent = 'Reporte de esta semana ya fue generado';
            reporteInfo.style.color = '#f59e0b';
            
            const finalizarBtn = reporteActivo.querySelector('button');
            if (finalizarBtn) {
                finalizarBtn.disabled = true;
                finalizarBtn.textContent = 'Reporte Ya Generado';
            }
        }
    }

    getNextFriday() {
        const now = new Date();
        const day = now.getDay();
        const friday = new Date(now);
        
        if (day <= 5) { // Si es de domingo a viernes
            friday.setDate(now.getDate() + (5 - day));
        } else { // Si es sábado
            friday.setDate(now.getDate() + 6);
        }
        
        friday.setHours(13, 0, 0, 0); // 1 PM
        return friday;
    }

    getTimeUntilReport(targetDate) {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) return 'Disponible ahora';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    // Mostrar mensajes al usuario
    showMessage(text, type = 'info') {
        // Remover mensajes existentes
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${text}
        `;

        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(message, mainContent.firstChild);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Modal de confirmación
    showConfirmModal(text, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const confirmText = document.getElementById('confirmText');
        const confirmBtn = document.getElementById('confirmBtn');

        confirmText.textContent = text;
        modal.classList.add('show');

        confirmBtn.onclick = () => {
            modal.classList.remove('show');
            onConfirm();
        };
    }

    // Cargar historial de reportes
    loadReportHistory() {
        const historialContainer = document.getElementById('historialReportes');
        
        if (this.data.reportHistory.length === 0) {
            historialContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>Sin reportes anteriores</h3>
                    <p>Los reportes semanales aparecerán aquí</p>
                </div>
            `;
            return;
        }

        // Ordenar por fecha más reciente
        const sortedHistory = [...this.data.reportHistory].sort((a, b) => 
            new Date(b.fecha) - new Date(a.fecha)
        );

        historialContainer.innerHTML = sortedHistory.map(reporte => {
            const fecha = new Date(reporte.fecha);
            const fechaFormatted = fecha.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const balance = reporte.ingresos - reporte.gastos;
            const balanceClass = balance >= 0 ? 'ingresos' : 'gastos';

            return `
                <div class="historial-item">
                    <div class="historial-header">
                        <div class="historial-week">Semana ${reporte.semana}</div>
                        <div class="historial-date">${fechaFormatted}</div>
                    </div>
                    <div class="historial-summary">
                        <div class="ingresos">
                            <strong>Ingresos</strong><br>
                            $${reporte.ingresos.toFixed(2)}
                        </div>
                        <div class="gastos">
                            <strong>Gastos</strong><br>
                            $${reporte.gastos.toFixed(2)}
                        </div>
                        <div class="balance ${balanceClass}">
                            <strong>Balance</strong><br>
                            $${balance.toFixed(2)}
                        </div>
                    </div>
                    ${reporte.comentario ? `
                        <div class="historial-comentario">
                            "${reporte.comentario}"
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
}

// Función global para finalizar semana
function finalizarSemana() {
    const weekData = app.getCurrentWeekData();
    
    if (weekData.reportGenerated) {
        app.showMessage('El reporte de esta semana ya fue generado', 'error');
        return;
    }

    app.showConfirmModal(
        '¿Estás seguro de que quieres finalizar la semana? Esta acción no se puede deshacer.',
        () => {
            const comentario = document.getElementById('comentarioReporte').value;
            const totalIngresos = weekData.ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
            const totalGastos = weekData.gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);

            const reporte = {
                semana: app.currentWeek.key,
                fecha: new Date().toISOString(),
                ingresos: totalIngresos,
                gastos: totalGastos,
                comentario: comentario || '',
                transacciones: {
                    ingresos: [...weekData.ingresos],
                    gastos: [...weekData.gastos]
                }
            };

            // Agregar reporte al historial
            app.data.reportHistory.push(reporte);
            
            // Marcar semana como reportada
            weekData.reportGenerated = true;
            
            app.saveData();
            app.updateReportStatus();
            app.loadReportHistory();
            app.showMessage('Reporte semanal generado y guardado exitosamente', 'success');

            // Limpiar comentario
            document.getElementById('comentarioReporte').value = '';
        }
    );
}

// Función global para cerrar modal
function cerrarModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

// Inicializar aplicación cuando el DOM esté cargado
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new FinanzApp();
    
    // Manejar clics fuera del modal
    document.getElementById('confirmModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('confirmModal')) {
            cerrarModal();
        }
    });

    // Manejar tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });

    console.log('FinanzApp inicializada correctamente');
});

// Service Worker para funcionalidad offline (opcional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service worker no disponible');
    });
}