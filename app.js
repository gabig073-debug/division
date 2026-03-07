// Datos globales
let detalleDani = Array.from({length:4},()=>Array(6).fill(0));
let detalleGabi = Array.from({length:4},()=>Array(6).fill(0));
let detallePapa = Array.from({length:4},()=>Array(6).fill(0));
let diaCargado = Array.from({length:4},()=>Array(6).fill(0));

let resumenDani = [0,0,0,0];
let resumenGabi = [0,0,0,0];
let resumenPapa = [0,0,0,0];

let semanaActual;
let diaActual;

const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

let semanaSeleccionada = 0;
let diaSeleccionado = 0;

// Navegación
function seleccionarSemana(s){

    semanaSeleccionada = s;
    semanaActual = s;
    
    document.getElementById("tituloSemana").innerText =
        "Semana " + s;

    document.body.classList.remove(
        "semana1",
        "semana2",
        "semana3",
        "semana4"
    );

    document.body.classList.add("semana" + s);

    mostrarPantalla("pantallaDias");
}

function seleccionarDia(d){
    diaSeleccionado = d;
    document.getElementById("pantallaDias").style.display = "none";
    document.getElementById("pantallaCarga").style.display = "block";
    document.getElementById("tituloDia").innerText = "Semana " + semanaSeleccionada + " - " + dias[d-1];

    diaActual = d;
    
const clave = "semana-" + semanaActual + "-dia-" + diaActual;
const datosGuardados = localStorage.getItem(clave);

if (datosGuardados) {
    const datos = JSON.parse(datosGuardados);

    document.getElementById("daniMonto").value = datos.daniMonto;
    document.getElementById("gabiMonto").value = datos.gabiMonto;
    document.getElementById("papaMonto").value = datos.papaMonto;
    document.getElementById("daniCant").value = datos.daniCant;
    document.getElementById("gabiCant").value = datos.gabiCant;
    document.getElementById("papaCant").value = datos.papaCant;
}
else {
    document.getElementById("daniMonto").value = "";
    document.getElementById("gabiMonto").value = "";
    document.getElementById("papaMonto").value = "";
    document.getElementById("daniCant").value = "";
    document.getElementById("gabiCant").value = "";
    document.getElementById("papaCant").value = "";
}
}

function volverSemanas(){
    document.getElementById("pantallaDias").style.display = "none";
    document.getElementById("pantallaSemanas").style.display = "block";
}

function volverDias(){
    mostrarPantalla("pantallaDias");
}

// Guardar día
function guardarDia(){
    let semana = semanaSeleccionada-1;
    let dia = diaSeleccionado-1;

    if(diaCargado[semana][dia]){
        if(!confirm("Ese día ya existe. ¿Reemplazar?")) return;
        resumenDani[semana]-=detalleDani[semana][dia];
        resumenGabi[semana]-=detalleGabi[semana][dia];
        resumenPapa[semana]-=detallePapa[semana][dia];
    }

    let daniMonto = Number(document.getElementById("daniMonto").value);
    let gabiMonto = Number(document.getElementById("gabiMonto").value);
    let papaMonto = Number(document.getElementById("papaMonto").value);
    let daniCant = Number(document.getElementById("daniCant").value);
    let gabiCant = Number(document.getElementById("gabiCant").value);
    let papaCant = Number(document.getElementById("papaCant").value);

    let sumam = daniMonto+gabiMonto+papaMonto;
    let sumac = daniCant+gabiCant+papaCant;
    if(sumac==0){ alert("Comensales = 0"); return; }
    let xpera = Math.floor(sumam/sumac);

    let d = daniMonto-(xpera*daniCant);
    let g = gabiMonto-(xpera*gabiCant);
    let p = papaMonto-(xpera*papaCant);

    detalleDani[semana][dia]=d;
    detalleGabi[semana][dia]=g;
    detallePapa[semana][dia]=p;
    diaCargado[semana][dia]=1;

    resumenDani[semana]+=d;
    resumenGabi[semana]+=g;
    resumenPapa[semana]+=p;

    document.getElementById("resultado").innerHTML = `
        Semana ${semana+1} - ${dias[dia]}<br>
        Por persona $${xpera}<br>
        Dani: ${formato(d)}<br>
        Gabi: ${formato(g)}<br>
        Papa: ${formato(p)}
    `;

    // Crear objeto con los datos
const datosDia = {
    daniMonto: document.getElementById("daniMonto").value,
    gabiMonto: document.getElementById("gabiMonto").value,
    papaMonto: document.getElementById("papaMonto").value,
    daniCant: document.getElementById("daniCant").value,
    gabiCant: document.getElementById("gabiCant").value,
    papaCant: document.getElementById("papaCant").value
};

// Crear clave única
const clave = "semana-" + semanaActual + "-dia-" + diaActual;

// Guardar en localStorage
localStorage.setItem(clave, JSON.stringify(datosDia));
}

function formato(v){ return v>=0?`Recibe $${v}`:`Debe $${Math.abs(v)}`; }

// Mostrar resumen/detalle/borrar desde pantallaDias
function mostrarDetalle(){
    let s = semanaSeleccionada-1;
    let html = `<h3>Detalle Semana ${s+1}</h3>`;
    for(let i=0;i<6;i++){
        if(diaCargado[s][i]){
            html+=`${dias[i]} → Dani: ${formato(detalleDani[s][i])}, Gabi: ${formato(detalleGabi[s][i])}, Papa: ${formato(detallePapa[s][i])}<br>`;
        }
    }
    document.getElementById("resultadoSemana").innerHTML = html;
}

function mostrarResumen(){
    let s = semanaSeleccionada-1;
    document.getElementById("resultadoSemana").innerHTML=`
    <h3>Resumen Semana ${s+1}</h3>
    Dani: ${formato(resumenDani[s])}<br>
    Gabi: ${formato(resumenGabi[s])}<br>
    Papa: ${formato(resumenPapa[s])}
    `;
}

function borrarSemana(){
    let s = semanaSeleccionada-1;
    if(!confirm("Borrar toda la semana?")) return;
    for(let i=0;i<6;i++){
        detalleDani[s][i]=0;
        detalleGabi[s][i]=0;
        detallePapa[s][i]=0;
        diaCargado[s][i]=0;
    }
    resumenDani[s]=0;
    resumenGabi[s]=0;
    resumenPapa[s]=0;
    document.getElementById("resultadoSemana").innerHTML="<b>Semana borrada</b>";
}

function mostrarPantalla(id){
    let pantallas = ["pantallaSemanas","pantallaDias","pantallaCarga"];
    pantallas.forEach(p => document.getElementById(p).style.display="none");

    let div = document.getElementById(id);
    div.style.display="block";
    div.classList.add("fade-in");

    // quitar clase después de la animación
    setTimeout(()=>{ div.classList.remove("fade-in"); }, 500);

}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/division/sw.js")
      .then(() => console.log("SW registrado"))
      .catch(err => console.log("Error SW", err));
  });
}

// ===== EFECTO RIPPLE =====

document.addEventListener("click", function(e) {

    const boton = e.target.closest(".boton");
    if (!boton) return;

    const circle = document.createElement("span");
    circle.classList.add("ripple");

    const rect = boton.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + "px";

    circle.style.left = (e.clientX - rect.left - size / 2) + "px";
    circle.style.top = (e.clientY - rect.top - size / 2) + "px";

    boton.appendChild(circle);

    setTimeout(() => {
        circle.remove();
    }, 600);
});

function reconstruirDatos() {

    for (let semana = 1; semana <= 4; semana++) {
        for (let dia = 1; dia <= 6; dia++) {

            const clave = "semana-" + semana + "-dia-" + dia;
            const datosGuardados = localStorage.getItem(clave);

            if (datosGuardados) {

                const datos = JSON.parse(datosGuardados);

                let s = semana - 1;
                let d = dia - 1;

                let daniMonto = Number(datos.daniMonto);
                let gabiMonto = Number(datos.gabiMonto);
                let papaMonto = Number(datos.papaMonto);
                let daniCant = Number(datos.daniCant);
                let gabiCant = Number(datos.gabiCant);
                let papaCant = Number(datos.papaCant);

                let sumam = daniMonto + gabiMonto + papaMonto;
                let sumac = daniCant + gabiCant + papaCant;

                if (sumac === 0) continue;

                let xpera = Math.floor(sumam / sumac);

                let dRes = daniMonto - (xpera * daniCant);
                let gRes = gabiMonto - (xpera * gabiCant);
                let pRes = papaMonto - (xpera * papaCant);

                detalleDani[s][d] = dRes;
                detalleGabi[s][d] = gRes;
                detallePapa[s][d] = pRes;

                resumenDani[s] += dRes;
                resumenGabi[s] += gRes;
                resumenPapa[s] += pRes;

                diaCargado[s][d] = 1;
            }
        }
    }
}

window.addEventListener("load", reconstruirDatos);
