
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

socket.on ('productos', loadProds => {
    loadProds = JSON.parse(listaProductos)
    renderProducts(loadProds)
})

document.getElementById('btnEnviar').addEventListener('click', () => {
    const nuevoProducto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        url: document.getElementById('thumbnail').value
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
    document.getElementById('tabla').innerHTML = html;

}


socket.on("productos", (productos) => {
    renderProducts(productos);
});

const form = document.getElementById('formChat');
const input = document.getElementById('input');


socket.on('messages', (data) => {
    const html = data.map((elem, index) => {
        return (`
            <div>
                <strong>${elem.email} ${elem.date}</strong>:
                <em>${elem.mensaje}</em>
            </div>
        `);
    }).join(' ');
    document.getElementById('messages').innerHTML = html;
});


function addMessage() {
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('textoMensaje').value;
    const nuevoMensaje = {
        email: email,
        mensaje: mensaje,
        date: getNow()
    };

    socket.emit('new-message', nuevoMensaje);
    return false;
}


getNow = () => {
    const now = new Date();
    return `${now.getDate()}/${now.getMonth()}/${now.getFullYear()},${now.getHours()}:${now.getMinutes()}`;
}