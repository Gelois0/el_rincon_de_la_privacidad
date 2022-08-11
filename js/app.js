
const { json, select, selectAll, geoOrthographic, geoPath, geoGraticule } = d3

let geojson, globe, projection, path, graticule, infoPanel, isMouseDown = false, rotation = { x: 0, y: 0 }

const globeSize = {
    w: window.innerWidth / 2,
    h: window.innerHeight
}

json('http://localhost/js/custom.geo.json').then(data => init(data))

const init = data => {
    geojson = data
    drawGlobe()
    drawGraticule()
    renderInfoPanel()
    createHoverEffect()
    createDraggingEvents()
}

const drawGlobe = () => {

    globe = select('body')
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)

    projection = geoOrthographic()
        .fitSize([globeSize.w, globeSize.h], geojson)
        .translate([window.innerWidth - globeSize.w / 2, window.innerHeight / 2])

    path = geoPath().projection(projection)

    globe
        .selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', '#ef3a3a')
        .style('stroke', '#18f04d')
        .attr('class', 'country')
}


const drawGraticule = () => {

    graticule = geoGraticule()

    globe
        .append('path')
        .attr('class', 'graticule')
        .attr('d', path(graticule()))
        .attr('fill', 'none')
        .attr('stroke', '#232323')

}

const renderInfoPanel = () => infoPanel = select('body').append('article').attr('class', 'info')

const createHoverEffect = () => {

    globe
        .selectAll('.country')
        .on('mouseover', function (e, d) {
            const { formal_en, economy, pop_est, subregion, region_wb,featurecla,type, name_ar,pop_year} = d.properties
            infoPanel.html(`<h1>${formal_en}</h1><hr<h1>${name_ar}</h1><hr><h1>${pop_year}</h1><hr><p>${economy}</p><hr><h2>${pop_est}</h2><hr><h2>${subregion}</h2><h2>${type}</h2><hr><h2>${region_wb}</h2> <hr><h1>${featurecla}</h1>   `)
            globe.selectAll('.country').style('fill', '#ef0bda').style('stroke', '#060a0f')
            select(this).style('fill', '#6ea9ff').style('stroke', 'white')
        })
}

const createDraggingEvents = () => {

    globe
        .on('mousedown', () => isMouseDown = true)
        .on('mouseup', () => isMouseDown = false)
        .on('mousemove', e => {

            if (isMouseDown) {
                const { movementX, movementY } = e

                rotation.x += movementX / 2
                rotation.y += movementY / 2

                projection.rotate([rotation.x, rotation.y])
                selectAll('.country').attr('d', path)
                selectAll('.graticule').attr('d', path(graticule()))
            }
        })
}