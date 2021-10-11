import { csstransition, TRANSITIONS } from '../src/csstransition'

function doEffect(name) {
    let target = document.getElementById('target')

    csstransition(target, name)
        .exit()
        .run(() => {
            console.log('EXIT Complete')

            csstransition(target, name)
                .enter(400)
                .run(() => {
                    console.log('ENTER Complete')
                }) 
        })
}

if (!document.getElementById('buttons').children.length) {
    Object.keys(TRANSITIONS).sort().forEach(k => {
        let button = document.createElement('button')
        
        button.innerHTML = k
        button.setAttribute('style', 'margin:2px')
        button.onclick = () => {
            doEffect(k)
        }
    
        document.getElementById('buttons').appendChild(button)
    })
}