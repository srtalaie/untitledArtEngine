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

let metadataList = []
let attributesList = []
let dnaList = []

const saveImg = (_editionCount) => {
    fs.writeFileSync(`./build/${_editionCount}.png`, canvas.toBuffer('image/png'))
}

const addMetaData = (_dna, _edition) => {
    let timestamp = Date.now()
    let tempMetadata = {
        dna: _dna,
        edition: _edition,
        date: timestamp,
        attributes: attributesList,
    }
    metadataList.push(tempMetadata)
    attributesList = []
}

const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement
    attributesList.push({
        name: selectedElement.name, 
    })
}

const loadLayerImg = async (_layer) => {
    return new Promise(async (resolve) => {
        const img = await loadImage(`${_layer.location}${_layer.selectedElement.fileName}`)
        resolve({layer: _layer, loadedImg: img})
    })
}

const drawElement = (_element) => {
    ctx.drawImage(
        _element.loadedImg,
        _element.layer.position.x,
        _element.layer.position.y,
        _element.layer.size.width,
        _element.layer.size.height
    )
    addAttributes(_element)
}

const constructLayerToDNA = (_dna, _layers) => {
    let dnaSegment = _dna.toString().match(/.{1,2}/g)
    let mapDNAToLayers = _layers.map((layer) => {
        let selectedElement = layer.elements[parseInt(dnaSegment) % layer.elements.length]
        return {
            location: layer.location,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement
        }
    })
    return mapDNAToLayers
}

const isDNAUnique = (_DNAList = [], _dna) => {
    let foundDNA = _DNAList.find((i) => {i === _dna})
    return foundDNA == undefined ? true : false
}

const createDNA = (_len) => {
    let randNum = Math.floor(Number(`1e${_len}`) + Math.random() * Number(`9e${_len}`))
    return randNum
}

const writeMetadata = (_data) => {
    fs.writeFileSync('./build/_metadata.json', _data)
}

const generateArt = async () => {
    writeMetadata("")
    let editionCount = 1
    while(editionCount <= editionSize){
        let newDNA = createDNA((layers.length * 2) - 1)
        if(isDNAUnique(dnaList, newDNA)){
            let results = constructLayerToDNA(newDNA, layers)
            let loadedElements = [] //array of promises

            results.forEach((layer) => {
                loadedElements.push(loadLayerImg(layer)) //promise
            })

            await Promise.all(loadedElements).then((elementArr) => {
               elementArr.forEach((element) => {
                   drawElement(element)
               })
               saveImg(editionCount)
               addMetaData(newDNA, editionCount)
               console.log(`Created edition: ${editionCount} - ${newDNA}`)
            })
            dnaList.push(newDNA)
            editionCount++
        } else {
            console.log('DNA already exists.')
        }
    }  
    writeMetadata(JSON.stringify(metadataList)) 
}

generateArt()