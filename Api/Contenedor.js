//importaciones
const {promises: fs} = require ('fs')
const {send} = require ('express')

//instancias
class Contenedor {
    constructor(route) {
        this.route = route
    }
    async getAll(req,res){
        try {
            const content = JSON.parse(await fs.readFile(`./${this.route}`,'utf-8'))
            return (content)
        } catch (error) {
            return (error)
        }
    }
    async deleteById (id) {
        try {
            const content = JSON.parse(await fs.readFile(`./${this.route}`,'utf-8'))
            const elementosFiltrados = content.filter(e => e.id !== id)
            await fs.writeFile(`./${this.route}`,JSON.stringify(elementosFiltrados, null, 2))
            console.log(elementosFiltrados)
            console.log(content)
        } catch (error) {
            console.log(error)
        }
    }
    async save( title,price, thumbnail) {
            const productos = await this.getAll()
            let newId;
            if(productos.length == 0){
                newId = 1;
            }else {
                newId = productos[productos.length - 1].id + 1;
            }
            const newObj = {
                title: title,
                price: price,
                thumbnail: thumbnail,
                id: newId}
            productos.push(newObj);
            try {
                await fs.writeFile(`./${this.route}`,JSON.stringify(productos, null, 2))
                return (newObj)
            } catch (error) {
                return(error)
            }
    }
    async getById(id){
        try {
            const content = JSON.parse(await fs.readFile(`./${this.route}`,'utf-8'))
            const elementosFiltrados = content.filter(e => e.id === (parseint(id)))
            console.log(elementosFiltrados)
            if (elementosFiltrados.length === 0){
                return ( {error:'no se encontro el producto'})
            } else {
                return (elementosFiltrados)
            }
        } catch (error) {
            return(error)
            null
        }
    }
    async deleteAll(){
        try {
            await fs.writeFile(`./${this.route}`,JSON.stringify([], null, 2))
            const content = JSON.parse(await fs.readFile(`./${this.route}`,'utf-8'))
            console.log(content)
        } catch (error) {
            console.log(error)
            return "no pudo eliminarse"
        }
    }
    async update(id, title, price, thumbnail){
        try {
            const content = JSON.parse(await fs.readFile(`./${this.route}`,'utf-8'))
            const elementosFiltrados = content.filter(e => e.id === (parseint(id)))
            if (elementosFiltrados.length === 0){
                return ( {error:'no se encontro el producto'})
            } else {
                elementosFiltrados[0].title = title
                elementosFiltrados[0].price = price
                elementosFiltrados[0].thumbnail = thumbnail
                await fs.writeFile(`./${this.route}`,JSON.stringify(content, null, 2))
                return (elementosFiltrados)
            }
        } catch (error) {
            return(error)
            null
        }
    }
}

module.exports = Contenedor