const btnEvaluar = documentElementById("btnEvaluar");
const btnLimpiar = document.getElementsByClassName("btnLimpiar");

btnEvaluar.addEventListener("Click", evaluarEstudiante);
btnLimpiar.addEventListener("Click", limpiarFormulario);
function evaluarEstudiante{
    alert("Evaluamos al estudianye");
}
function evaluarEstudiante() {
  const nombre = document.getElementById("nombre").value.trim();
  const carrera = document.getElementById("carrera").value;
  const nota1Texto = document.getElementById("nota1").value;
  const nota2Texto = document.getElementById("nota2").value;
  const nota3Texto = document.getElementById("nota3").value;

  if (nombre === "" || carrera === "" || nota1Texto === "" || nota2Texto === "" || nota3Texto === "") {
    mostrarResultado("Debe completar todos los campos.", "danger");

    return;
  }
  const notas=[Number(nota1Texto), Number(nota2Texto), Number(nota3Texto)];
  if(existeNotaInvalida(notas)){
    mostrarResultado("Cada nota debe estar entre 0 y 20")
    return
  }
  const nombre={
    nombre: nombr,
    carrera: carrera,
    notas: notas,
    promedio: promedio,
    estado: estado
  };

  mostrarResultado(construirMensaje(estudiante), ObtenerColorEstado(estado))
  mostrarJSON(estudiante);
  console.table(estudiante);
}

