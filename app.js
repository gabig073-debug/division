let gastos = JSON.parse(localStorage.getItem("gastos")) || {}

let semanaActual = 0
let diaActual = 0

const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]


// ===== HELPERS =====

function guardarDB(){
localStorage.setItem("gastos", JSON.stringify(gastos))
}

function $(id){
return document.getElementById(id)
}


// ===== PANTALLAS =====

function mostrarPantalla(id){

["pantallaSemanas","pantallaDias","pantallaCarga"].forEach(p=>{
$(p).style.display="none"
})

$(id).style.display="block"
}


// ===== SEMANA =====

function seleccionarSemana(s){
semanaActual = s
$("tituloSemana").innerText = "Semana "+s
mostrarPantalla("pantallaDias")
}


// ===== DIA =====

function seleccionarDia(d){

diaActual = d

$("tituloDia").innerText =
"Semana "+semanaActual+" - "+dias[d-1]

mostrarPantalla("pantallaCarga")

let datos = gastos[semanaActual+"-"+diaActual]

if(datos){

$("daniMonto").value = datos.dm
$("gabiMonto").value = datos.gm
$("papaMonto").value = datos.pm

$("daniCant").value = datos.dc
$("gabiCant").value = datos.gc
$("papaCant").value = datos.pc

}else{

$("daniMonto").value=""
$("gabiMonto").value=""
$("papaMonto").value=""

$("daniCant").value=""
$("gabiCant").value=""
$("papaCant").value=""

}

}


// ===== GUARDAR DIA (MODIFICADO) =====

function guardarDia(){

let dm = Number($("daniMonto").value) || 0
let gm = Number($("gabiMonto").value) || 0
let pm = Number($("papaMonto").value) || 0

let dc = Number($("daniCant").value) || 0
let gc = Number($("gabiCant").value) || 0
let pc = Number($("papaCant").value) || 0

let monto = dm+gm+pm
let cant = dc+gc+pc

// 👉 GUARDAR SIEMPRE (aunque esté vacío)
gastos[semanaActual+"-"+diaActual] = {dm,gm,pm,dc,gc,pc}

guardarDB()

// 👉 SI ESTA VACÍO
if(monto==0 && cant==0){
$("resultado").innerHTML = "<b>Día vaciado</b>"
return
}

// 👉 SI NO HAY COMENSALES (PERO PUEDE HABER PLATA)
if(cant==0){
$("resultado").innerHTML = "<b>Día guardado (sin comensales)</b>"
return
}

let x = Math.floor(monto/cant)

let d = dm-(x*dc)
let g = gm-(x*gc)
let p = pm-(x*pc)

$("resultado").innerHTML = `
Semana ${semanaActual} - ${dias[diaActual-1]}<br>
Por persona $${x}<br>
Dani: ${formato(d)}<br>
Papá: ${formato(g)}<br>
Gabi: ${formato(p)}
`

}


// ===== FORMATO =====

function formato(v){
return v>=0 ? "Recibe $"+v : "Debe $"+Math.abs(v)
}


// ===== DETALLE =====

function mostrarDetalle(){

let html = "<h3>Detalle Semana "+semanaActual+"</h3>"

for(let clave in gastos){

if(clave.startsWith(semanaActual+"-")){

let d = gastos[clave]

let monto = d.dm+d.gm+d.pm
let cant = d.dc+d.gc+d.pc

if(monto==0 && cant==0) continue
if(cant==0) continue

let x = Math.floor(monto/cant)

let r1 = d.dm-(x*d.dc)
let r2 = d.gm-(x*d.gc)
let r3 = d.pm-(x*d.pc)

let dia = clave.split("-")[1]

html +=
dias[dia-1]+" → "+
"Dani: "+formato(r1)+", "+
"Papá: "+formato(r2)+", "+
"Gabi: "+formato(r3)

}

}

$("resultadoSemana").innerHTML = html

}


// ===== RESUMEN =====

function mostrarResumen(){

let totalD=0,totalG=0,totalP=0

for(let clave in gastos){

if(clave.startsWith(semanaActual+"-")){

let d = gastos[clave]

let monto = d.dm+d.gm+d.pm
let cant = d.dc+d.gc+d.pc

if(monto==0 && cant==0) continue
if(cant==0) continue

let x = Math.floor(monto/cant)

totalD += d.dm-(x*d.dc)
totalG += d.gm-(x*d.gc)
totalP += d.pm-(x*d.pc)

}

}

$("resultadoSemana").innerHTML = `
<h3>Resumen Semana ${semanaActual}</h3>
Dani: ${formato(totalD)}<br>
Papá: ${formato(totalG)}<br>
Gabi: ${formato(totalP)}
`

}

// ===== NAVEGACION =====

function volverDias(){
mostrarPantalla("pantallaDias")
$("resultado").innerHTML = ""
}

function volverSemanas(){
mostrarPantalla("pantallaSemanas")
}

function limpiarCampos(){

$("daniMonto").value=""
$("gabiMonto").value=""
$("papaMonto").value=""

$("daniCant").value=""
$("gabiCant").value=""
$("papaCant").value=""

$("resultado").innerHTML = "<b>Campos limpiados</b>"
}
