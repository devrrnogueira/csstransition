# csstransition

## intall
`npm i csstransition`

## usage 
``` html
    <div id="target1" stype="background:red;padding:40px">My target1</div>
    <div id="target2" stype="background:red;padding:40px">My target2</div>
```

``` css
/* Creating custom transition */
/* MyTransition */
.transition__MyTransition__enter {
    transform: translate(30%) translateZ(600px) rotate(10deg) scale(1.3)!important;
    opacity: 0!important;
}
.transition__MyTransition__enter-active {
    transition: opacity .2s, transform .3s!important;
	transform: none!important;
    opacity: 1!important;
}
.transition__MyTransition__exit-active {
    transition: opacity 0.2s, transform 0.3s!important;
    transform: translate(30%) translateZ(600px) rotate(10deg) scale(1.3)!important;
    opacity: 0!important;
}
```

``` javascript
import { csstransition, TRANSITIONS } from 'css-transition-rule'

// TRANSITIONS contains:
//      Fade, Fall, ScaleUp, HorizontalFlip3D, Newspaper, 
//      SideFall, Sign3D, SuperScale, SlideFromRight, 
//      SlideFromLeft, SlideFromBottom, SlideFromTop, 
//      Slide_StickToTop, VerticalFlip3D

let el1 = document.querySelector('#target1')
let el2 = document.querySelector('#target2')

csstransition(el1, 'MyTransition')
    .exit()
    .run(() => {
        console.log('transition 1 completed')

        csstransition(el1, TRANSITIONS.Slide_StickToTop)
            .enter()
            .run(() => {
                console.log('transition 2 completed')        
            })
    })

csstransition()
    .add(el1, TRANSITIONS.Fall)
    .add(el2, TRANSITIONS.Newspaper)
    .enter()
    .sequence(() => {
        console.log('transition completed')
    })
```
