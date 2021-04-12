
let fadeIn = [
    'fade-in-enter',
    'fade-in-enter-active'
]
let fadeOut = [
    'fade-out-enter', //state0
    'fade-out-enter-active' //state1
]

let scaleToTop = [
    //state0
    {
        props: {
            opacity: 0,
            transform: 'scale(0.4) translateY({height}px)'
        }
    },

    //state1
    {
        props: {
            duration: 400, //em milisegundos
            opacity: 1,
            transform: 'scale(1) translateY(0)'
        }
    }
]

let rightToLeft = [
    {
        rule: 'left-to-right-enter',
        
    }
]


// {
//     rule: 'fade-in-enter',
//     props: {
//         display: 'block'
//     }
// },
// {
//     rule: 'fade-in-enter-active',
//     props: {
//         display: 'block'
//     }
// }