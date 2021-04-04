import csstransition from '../src/csstransition'


const animations = [
    {
        name: 'slide-left',
        state: 'slide-left'
    },
    {
        name: 'slide-right',
        state: 'slide-right'
    },
    {
        name: 'slide-top',
        state: 'slide-top'
    },
    {
        name: 'slide-bottom',
        state: 'slide-bottom'
    },
    {
        name: 'scaleToTopShow',
        state: [
            {
                prestate(el, params) {
                    params.height = el.offsetHeight
                },
                props: {
                    opacity: 0,
                    transform: 'scale(0.4) translateY({height}px)'
                }
            },
            {
                props: {
                    duration: 300,
                    opacity: 1,
                    transform: 'scale(1) translateY(0)'
                }
            }
        ]
    },
    {
        name: 'scaleToTopHide',
        state: [
            null,
            {
                prestate(el, params) {
                    params.height = el.offsetHeight
                },
                props: {
                    duration: 300,
                    opacity: 0,
                    transform: 'scale(0.4) translateY({height}px)'
                }
            }
        ]
    }
]

function createSelect(onchange) {
    let html = ''
    const select = document.querySelector('#select')

    animations.forEach((item, i) => {
        html += (`<option value="${i}">${item.name}</option>`)
    })
    
    select.onchange = () => {
        onchange(select.value)
    }

    select.innerHTML = html

    return select
}

createSelect((index) => {
    let target = document.querySelector('#target')
    let animation = animations[index]

    csstransition(target)
        .run(animation.state)
})