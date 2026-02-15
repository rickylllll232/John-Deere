class Tarea {
  constructor(nombre, completa = false) {
    this.nombre = nombre;
    this.completa = completa;
  }

  toggleEstado() {
    this.completa = !this.completa;
  }

  editar(nuevoNombre) {
    this.nombre = nuevoNombre;
  }
}

class GestorDeTareas {
  constructor() {
    this.tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  }

  agregar(tarea) {
    this.tareas.push(tarea);
    this.guardar();
  }

  eliminar(index) {
    this.tareas.splice(index, 1);
    this.guardar();
  }

  editar(index, nuevoNombre) {
    this.tareas[index].editar(nuevoNombre);
    this.guardar();
  }

  guardar() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }
}

const gestor = new GestorDeTareas();

const input = document.getElementById("nueva-tarea");
const btn = document.getElementById("btn-agregar");
const lista = document.getElementById("lista-tareas");
const error = document.getElementById("error");

const renderizar = () => {
  lista.innerHTML = "";

  gestor.tareas.forEach((tarea, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${tarea.completa ? "completa" : ""}">
        ${tarea.nombre}
      </span>
      <div>
        <button onclick="editarTarea(${index})">Editar</button>
        <button onclick="eliminarTarea(${index})">Eliminar</button>
      </div>
    `;

    lista.appendChild(li);
  });
};

btn.addEventListener("click", () => {
  const texto = input.value.trim();

  if (texto === "") {
    error.textContent = "No puedes agregar una tarea vacía.";
    return;
  }

  error.textContent = "";
  gestor.agregar(new Tarea(texto));
  input.value = "";
  renderizar();
});

window.eliminarTarea = (index) => {
  gestor.eliminar(index);
  renderizar();
};

window.editarTarea = (index) => {
  const nuevo = prompt("Editar tarea:", gestor.tareas[index].nombre);
  if (nuevo && nuevo.trim() !== "") {
    gestor.editar(index, nuevo.trim());
    renderizar();
  }
};

renderizar();

