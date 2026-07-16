const btnEvaluar = document.getElementById("btnEvaluar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnHistorial = document.getElementById("btnHistorial");
const btnRanking = document.getElementById("btnRanking");
const btnBuscar = document.getElementById("btnBuscar");

let historial = [];

btnEvaluar.addEventListener("click", evaluarEstudiante);
btnLimpiar.addEventListener("click", limpiarFormulario);
btnHistorial.addEventListener("click", mostrarHistorial);
btnRanking.addEventListener("click", mostrarRanking);
btnBuscar.addEventListener("click", buscarEstudiante);

function evaluarEstudiante() {
    const nombre = document.getElementById("nombre").value.trim();
    const carrera = document.getElementById("carrera").value;
    const nota1Texto = document.getElementById("nota1").value;
    const nota2Texto = document.getElementById("nota2").value;
    const nota3Texto = document.getElementById("nota3").value;
    const nota4Texto = document.getElementById("nota4").value;

    if (nombre.length < 5) {
        mostrarResultado("El nombre debe tener mínimo 5 caracteres.", "danger");
        return;
    }

    if (nombre === "" || carrera === "" || nota1Texto === "" || nota2Texto === "" || nota3Texto === "" || nota4Texto === "") {
        mostrarResultado("Debe completar todos los campos.", "danger");
        return;
    }

    if (existeNombreRepetido(nombre)) {
        mostrarResultado("Ya existe un estudiante con ese nombre. Ingrese uno diferente.", "danger");
        return;
    }

    const notas = [Number(nota1Texto), Number(nota2Texto), Number(nota3Texto), Number(nota4Texto)];

    if (existeNotaInvalida(notas)) {
        mostrarResultado("Cada nota debe estar entre 0 y 20", "danger");
        return;
    }

    const promedio = calcularPromedio(notas);
    const promedioSinBaja = calcularPromedioSinBaja(notas);
    const estado = clasificarEstado(promedio);
    const rendimiento = clasificarRendimiento(promedio);
    const recomendacion = obtenerRecomendacion(promedio);
    const notaAlta = obtenerNotaMasAlta(notas);
    const notaBaja = obtenerNotaMasBaja(notas);
    const conteo = contarAprobadas(notas);
    const beca = calcularBeca(carrera, promedio);

    const estudiante = {
        nombre: nombre,
        carrera: carrera,
        notas: notas,
        promedio: promedio,
        promedioSinBaja: promedioSinBaja,
        notaMasAlta: notaAlta,
        notaMasBaja: notaBaja,
        estado: estado,
        rendimiento: rendimiento,
        beca: beca,
        recomendacion: recomendacion,
        aprobadas: conteo.aprobadas,
        recuperacion: conteo.recuperacion,
        reprobadas: conteo.reprobadas
    };

    historial.push(estudiante);

    mostrarResultado(construirMensaje(estudiante), obtenerColorEstado(estado));
    mostrarBeca(beca);
    actualizarTarjetaTotal();
    mostrarJSON();

    console.log("=== HISTORIAL (" + historial.length + " estudiantes) ===");
    console.log(JSON.stringify(historial, null, 2));
    console.table(historial);
}

function calcularPromedio(notas) {
    if (notas.length === 0) return 0;
    let suma = 0;
    for (const nota of notas) {
        suma += nota;
    }
    return parseFloat((suma / notas.length).toFixed(2));
}

function calcularPromedioSinBaja(notas) {
    let min = obtenerNotaMasBaja(notas);
    let suma = 0;
    let eliminada = false;
    for (const nota of notas) {
        if (nota === min && !eliminada) {
            eliminada = true;
            continue;
        }
        suma += nota;
    }
    return parseFloat((suma / (notas.length - 1)).toFixed(2));
}

function clasificarEstado(promedio) {
    if (promedio >= 14) {
        return "Aprobado";
    } else if (promedio >= 10) {
        return "Recuperación";
    } else {
        return "Reprobado";
    }
}

function clasificarRendimiento(promedio) {
    if (promedio >= 18) {
        return "Alto";
    } else if (promedio >= 14) {
        return "Medio";
    } else if (promedio >= 10) {
        return "Básico";
    } else {
        return "Bajo";
    }
}

function obtenerRecomendacion(promedio) {
    if (promedio >= 18) {
        return "Mantener el desempeño y apoyar a compañeros.";
    } else if (promedio >= 14) {
        return "Reforzar temas específicos.";
    } else if (promedio >= 10) {
        return "Asistir a tutorías y practicar ejercicios.";
    } else {
        return "Repetir contenidos base y solicitar acompañamiento.";
    }
}

function obtenerColorEstado(estado) {
    switch (estado) {
        case "Aprobado":
            return "success";
        case "Recuperación":
            return "warning";
        case "Reprobado":
            return "danger";
        default:
            return "secondary";
    }
}

function existeNotaInvalida(notas) {
    for (const nota of notas) {
        if (nota < 0 || nota > 20 || isNaN(nota)) {
            return true;
        }
    }
    return false;
}

function existeNombreRepetido(nombre) {
    for (const est of historial) {
        if (est.nombre.toLowerCase() === nombre.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function obtenerNotaMasAlta(notas) {
    let max = notas[0];
    for (let i = 1; i < notas.length; i++) {
        if (notas[i] > max) {
            max = notas[i];
        }
    }
    return max;
}

function obtenerNotaMasBaja(notas) {
    let min = notas[0];
    for (let i = 1; i < notas.length; i++) {
        if (notas[i] < min) {
            min = notas[i];
        }
    }
    return min;
}

function contarAprobadas(notas) {
    let aprobadas = 0;
    let recuperacion = 0;
    let reprobadas = 0;
    for (const nota of notas) {
        if (nota >= 14) {
            aprobadas++;
        } else if (nota >= 10) {
            recuperacion++;
        } else {
            reprobadas++;
        }
    }
    return { aprobadas: aprobadas, recuperacion: recuperacion, reprobadas: reprobadas };
}

function calcularBeca(carrera, promedio) {
    if (carrera === "TI" && promedio > 18) {
        return 100;
    } else if (carrera === "Software" && promedio > 17) {
        return 80;
    } else if (carrera === "Sistemas" && promedio > 16) {
        return 60;
    } else {
        return 0;
    }
}

function contarPorEstado() {
    let aprobados = 0;
    let recuperacion = 0;
    let reprobados = 0;
    for (const est of historial) {
        if (est.estado === "Aprobado") {
            aprobados++;
        } else if (est.estado === "Recuperación") {
            recuperacion++;
        } else {
            reprobados++;
        }
    }
    return { aprobados: aprobados, recuperacion: recuperacion, reprobados: reprobados };
}

function promedioGeneral() {
    if (historial.length === 0) return 0;
    let suma = 0;
    for (const est of historial) {
        suma += est.promedio;
    }
    return parseFloat((suma / historial.length).toFixed(2));
}

function buscarEstudiante() {
    const nombreBuscado = document.getElementById("busqueda").value.trim();
    if (nombreBuscado === "") {
        mostrarResultado("Ingrese un nombre para buscar.", "warning");
        return;
    }
    const resultados = [];
    for (const est of historial) {
        if (est.nombre.toLowerCase().includes(nombreBuscado.toLowerCase())) {
            resultados.push(est);
        }
    }
    const salida = document.getElementById("salidaJSON");
    if (resultados.length === 0) {
        mostrarResultado("No se encontró ningún estudiante con ese nombre.", "warning");
        return;
    }
    salida.classList.remove("d-none");
    salida.textContent = JSON.stringify(resultados, null, 2);
}

function generarRanking() {
    let copia = [];
    for (const est of historial) {
        copia.push(est);
    }
    for (let i = 0; i < copia.length - 1; i++) {
        for (let j = 0; j < copia.length - 1 - i; j++) {
            if (copia[j].promedio < copia[j + 1].promedio) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            }
        }
    }
    return copia;
}

function obtenerMejorPromedio() {
    if (historial.length === 0) return null;
    let mejor = historial[0];
    for (let i = 1; i < historial.length; i++) {
        if (historial[i].promedio > mejor.promedio) {
            mejor = historial[i];
        }
    }
    return mejor;
}

function obtenerPeorPromedio() {
    if (historial.length === 0) return null;
    let peor = historial[0];
    for (let i = 1; i < historial.length; i++) {
        if (historial[i].promedio < peor.promedio) {
            peor = historial[i];
        }
    }
    return peor;
}

function construirMensaje(estudiante) {
    return `${estudiante.nombre}, tu nota más alta es ${estudiante.notaMasAlta} y tu nota más baja es ${estudiante.notaMasBaja}. Aprobadas: ${estudiante.aprobadas} | Recuperación: ${estudiante.recuperacion} | Reprobadas: ${estudiante.reprobadas}. Promedio: ${estudiante.promedio} | Sin baja: ${estudiante.promedioSinBaja} | Estado: ${estudiante.estado}. Rendimiento: ${estudiante.rendimiento}. ${estudiante.recomendacion}`;
}

function mostrarResultado(mensaje, tipo) {
    const resultado = document.getElementById("resultado");
    resultado.classList.remove("d-none");
    resultado.className = `alert alert-${tipo} mt-4`;
    resultado.textContent = mensaje;
}

function mostrarBeca(beca) {
    const divBeca = document.getElementById("beca");
    if (divBeca) {
        divBeca.classList.remove("d-none");
        if (beca === 100) {
            divBeca.className = "alert alert-success mt-2";
            divBeca.textContent = "Beca del 100% otorgada.";
        } else if (beca === 80) {
            divBeca.className = "alert alert-primary mt-2";
            divBeca.textContent = "Beca del 80% otorgada.";
        } else if (beca === 60) {
            divBeca.className = "alert alert-warning mt-2";
            divBeca.textContent = "Beca del 60% otorgada.";
        } else {
            divBeca.className = "alert alert-secondary mt-2";
            divBeca.textContent = "No aplica beca.";
        }
    }
}

function mostrarJSON() {
    const salida = document.getElementById("salidaJSON");
    if (salida) {
        salida.classList.remove("d-none");
        salida.textContent = JSON.stringify(historial, null, 2);
    }
}

function mostrarHistorial() {
    actualizarTarjetaTotal();
    const tabla = document.getElementById("tablaHistorial");
    if (tabla) {
        tabla.classList.remove("d-none");
        if (historial.length === 0) {
            tabla.innerHTML = '<div class="alert alert-warning mb-0">No hay estudiantes en el historial.</div>';
        } else {
            tabla.innerHTML = construirTablaHistorial();
        }
    }

    const salida = document.getElementById("salidaJSON");
    if (salida) {
        salida.classList.remove("d-none");
        if (historial.length === 0) {
            salida.textContent = "No hay estudiantes en el historial.";
            return;
        }
        let conteo = contarPorEstado();
        let general = promedioGeneral();
        let mejor = obtenerMejorPromedio();
        let peor = obtenerPeorPromedio();

        let contenido = "=== HISTORIAL (" + historial.length + " estudiantes) ===\n";
        contenido += "Aprobados: " + conteo.aprobados + " | Recuperación: " + conteo.recuperacion + " | Reprobados: " + conteo.reprobados + "\n";
        contenido += "Promedio general del curso: " + general + "\n";
        if (mejor) contenido += "Mejor promedio: " + mejor.nombre + " (" + mejor.promedio + ")\n";
        if (peor) contenido += "Peor promedio: " + peor.nombre + " (" + peor.promedio + ")\n";
        contenido += "\n" + JSON.stringify(historial, null, 2);
        salida.textContent = contenido;
    }
    console.log("=== HISTORIAL COMPLETO ===");
    console.log(JSON.stringify(historial, null, 2));
    console.table(historial);
}

function construirTablaHistorial() {
    let filas = "";
    for (let i = 0; i < historial.length; i++) {
        const est = historial[i];
        filas += "<tr>" +
            "<td>" + (i + 1) + "</td>" +
            "<td>" + est.nombre + "</td>" +
            "<td>" + est.carrera + "</td>" +
            "<td>" + est.promedio + "</td>" +
            "<td>" + est.estado + "</td>" +
            "<td>" + est.rendimiento + "</td>" +
            "<td>" + (est.beca > 0 ? est.beca + "%" : "Sin beca") + "</td>" +
            "</tr>";
    }
    return '<table class="table table-striped table-bordered align-middle">' +
        "<thead class='table-dark'><tr>" +
        "<th>#</th><th>Nombre</th><th>Carrera</th><th>Promedio</th>" +
        "<th>Estado</th><th>Rendimiento</th><th>Beca</th>" +
        "</tr></thead><tbody>" + filas + "</tbody></table>";
}

function actualizarTarjetaTotal() {
    const tarjeta = document.getElementById("tarjetaTotal");
    const total = document.getElementById("totalEstudiantes");
    if (tarjeta && total) {
        tarjeta.classList.remove("d-none");
        total.textContent = historial.length;
    }
}

function mostrarRanking() {
    const salida = document.getElementById("salidaJSON");
    if (salida) {
        salida.classList.remove("d-none");
        if (historial.length === 0) {
            salida.textContent = "No hay estudiantes para rankear.";
            return;
        }
        let ranking = generarRanking();
        let contenido = "=== RANKING DE ESTUDIANTES ===\n\n";
        for (let i = 0; i < ranking.length; i++) {
            contenido += (i + 1) + ". " + ranking[i].nombre + " - Promedio: " + ranking[i].promedio + " - Estado: " + ranking[i].estado + "\n";
        }
        contenido += "\n" + JSON.stringify(ranking, null, 2);
        salida.textContent = contenido;
    }
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("carrera").value = "";
    document.getElementById("nota1").value = "";
    document.getElementById("nota2").value = "";
    document.getElementById("nota3").value = "";
    document.getElementById("nota4").value = "";
    document.getElementById("busqueda").value = "";

    document.getElementById("resultado").classList.add("d-none");
    document.getElementById("beca").classList.add("d-none");
    document.getElementById("salidaJSON").classList.add("d-none");
    document.getElementById("tablaHistorial").classList.add("d-none");
    document.getElementById("tarjetaTotal").classList.add("d-none");
}
