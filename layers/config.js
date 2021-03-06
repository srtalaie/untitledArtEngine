const fs = require('fs')
const path = require('path')

const dir = __dirname
const width = 1000
const height = 1000


const cleanName = (_str) => {
  let name = _str.slice(0, -4)
  return name
}

const getElements = (_path, _elementCount) => {
    return fs
        .readdirSync(_path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
            return {
                id: index + 1,
                name: cleanName(i),
                fileName: i,
                path: `${_path}/${i}`,
            }
        })
}

const layers = [
    {
        location: path.normalize(`${dir}/Background/`),
        elements: getElements(path.normalize(`${dir}/Background/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
    {
        location: path.normalize(`${dir}/Eyeball/`),
        elements: getElements(path.normalize(`${dir}/Eyeball/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
    {
        location: path.normalize(`${dir}/Eye color/`),
        elements: getElements(path.normalize(`${dir}/Eye color/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
    {
        location: path.normalize(`${dir}/Iris/`),
        elements: getElements(path.normalize(`${dir}/Iris/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
    {
        location: path.normalize(`${dir}/Shine/`),
        elements: getElements(path.normalize(`${dir}/Shine/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
    {
        location: path.normalize(`${dir}/Top lid/`),
        elements: getElements(path.normalize(`${dir}/Top lid/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
    {
        location: path.normalize(`${dir}/Bottom lid/`),
        elements: getElements(path.normalize(`${dir}/Bottom lid/`)),
        position: {x: 0, y: 0},
        size: {width, height}
    },
]

module.exports = {
    layers,
    width,
    height,
}