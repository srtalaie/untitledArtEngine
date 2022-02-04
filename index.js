const fs = require('fs')
const args = process.argv.slice(2)
const { createCanvas, loadImage } = require('canvas')
const {
    layers,
    height,
    width,
} = require('./layers/config')

const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')

//Amount you want to generate based on passed argument
const editionSize = args.length > 0 ? Number(args[0]) : 1

let metadata = []
let attributes = []
let hash = []
let decodedHash = []
let dnaList = []

const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`./build/${_edition}.png`, _canvas.toBuffer('image/png'))
}

const addMetaData = (_edition) => {
    let timestamp = Date.now()
    let tempMetadata = {
        hash: hash.join(""),
        decodedHash: decodedHash,
        edition: _edition,
        date: timestamp,
        attributes: attributes,
    }
    metadata.push(tempMetadata)
    attributes = []
    hash = []
    decodedHash = []
}

const addAttributes = (_element, _layer) => {
    let tempAttr = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
    }
    attributes.push(tempAttr)
    hash.push(_layer.id)
    hash.push(_element.id)
    decodedHash.push({[_layer.id]: _element.id})
}

const drawLayer = async (_layer, _edition) => {
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)]
    addAttributes(element, _layer)
    const img = await loadImage(`${element.path}`)
    ctx.drawImage(
        img,
        _layer.position.x,
        _layer.position.y,
        _layer.size.width,
        _layer.size.height
    )
    saveLayer(canvas, _edition)
}

const writeMetadata = () => {
    fs.writeFileSync('./build/_metadata.json', JSON.stringify(metadata))
}

const generateArt = () => {
    let editionCount = 1
    while(editionCount <= editionSize){
        layers.forEach((layer) => {
            drawLayer(layer, editionCount)
        })
        addMetaData(editionCount)
        console.log(`Creating edition ${editionCount}`)
        editionCount++
    }   
}

generateArt()
writeMetadata()