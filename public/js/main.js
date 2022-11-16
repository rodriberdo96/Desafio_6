const socket = io.connect();



async function loadProds(listaProductos) {
    let htmlProd = ''
    const tableList = await fetch('views/partials/table.ejs').then(res => res.text())

    if (listaProductos.length === 0){
        htmlProd = `<h4>No se encontraron productos.</h4>`
    }else{
        htmlProd = ejs.render(tableList, {listaProductos})
    }

    document.getElementById('tabla').innerHTML = htmlProd; 
}

socket.on ('productos', (loadProds) => {
    loadProds = JSON.parse(listaProductos)
    renderProducts(loadProds)
})

document.getElementById('btnEnviar').addEventListener('click', () => {
    const nuevoProducto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        url: document.getElementById('url').value
    }
socket.emit("guardarNuevoProducto",nuevoProducto)
})


function renderProducts(productos) {
    const html = productos.map((elem, index) => {
        return (`
            <tr>
                <td>${elem.title}</td>
                <td>${elem.price}</td>
                <td>${elem.thumbnail}</td>
            </tr>
        `);
    }).join(" ");
    document.getElementById('productos').innerHTML = html;

}


socket.on("productos", (productos) => {
    renderProducts(productos);
});


function addMessage() {
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("textoMensaje").value;
    const nuevoMensaje = { 
        email: email,
        mensaje: mensaje
    };
    socket.emit('new-message', nuevoMensaje);
    return false;
}




function render(data) {
    const html = data.map((elem, index) => {
        return (`
            <div>
                <strong>${elem.nombre}</strong>:
                <em>${elem.mensaje}</em>
            </div>
        `);
    }).join(' ');
    document.getElementById('messages').innerHTML = html;
    }


socket.on('mensajes', function(data) {
    render(data);
})


