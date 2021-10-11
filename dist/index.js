//@ts-check

import './transitions.css'

class CSSTransition {
    /**
     * @param {Element} target?
     * @param {Array|String} statesOrName?
     */
    constructor(target = null, statesOrName = null) {
        /**
         * @type {Array<{target:Element, states:Array<{prestate?:Function, rule?:String, props?:Object}>}>}
         */
        this._transitions = []

        /**
         * @type {Array<{target:Element, states:Array<{prestate?:Function, rule?:String, props?:Object}>}>}
         */
        this._activeTransitions = []
        
        this._delay = 0

        if (target) {
            this.add(target, statesOrName || TRANSITIONS.Fade)
        }
    }

    /**
     * 
     * @param {Element} target?
     * @param {Array<{prestate?:Function, rule?:String, props?:Object}>|String} statesOrName?
     * @returns {CSSTransition}
     */
    add(target, statesOrName) { 
        let states = typeof (statesOrName) == 'string'
            ? [{rule: String(statesOrName)}]
            : statesOrName
        
        if (states.length < 2) {
            states.push({
                ...states[0]
            })
        } 

        this._transitions.push({
            target,
            states
        })

        return this
    }

    /**
     * @description Prepare 'enter' transition
     * @param {Number} delay?
     * @returns {CSSTransition}
     */
    enter(delay = 0) {
        this._delay = delay
        this._type = 'enter'

        this._activeTransitions = this._transitions.map(transition => {
            let states = transition.states

            return {
                target: transition.target,
                states: [
                    {
                        rule: states[0].rule ? `transition__${states[0].rule}__enter` : null
                    },
                    {
                        rule: states[1].rule ? `transition__${states[1].rule}__enter-active` : null
                    }
                ]
            }
        })

        return this
    }

    /**
     * @description Prepare 'exit' transition
     * @param {Number} delay?
     * @returns {CSSTransition}
     */
    exit(delay = 0) {
        this._delay = delay
        this._type = 'exit'

        this._activeTransitions = this._transitions.map(transition => {
            let states = transition.states

            return {
                target: transition.target,
                states: [
                    {
                        rule: null
                    },
                    {
                        rule: states[1].rule ? `transition__${states[1].rule}__exit-active` : null
                    }
                ]
            }
        })

        return this
    }

    /**
     * @param {Function} complete?
     */
    paralell(complete = null) {
        let canceled = false
        let transitions = this._activeTransitions

        state0()
        reflow()

        setTimeout(()=>{
            state1(state2)
        },this._delay || 1)

        function state0(){
            if (canceled) {
                return
            }

            transitions.forEach(({target}, index) => {
                let targetClear = target['clear']
                targetClear && targetClear(true, index == transitions.length - 1)
            })

            transitions.forEach((transition) => {
                let target = transition.target

                if (!target['_stage0']) {
                    target['_stage0'] = true
                    target['_style'] = target.getAttribute('style')
                    target['_class'] = target.getAttribute('class')
                    target['clear'] = clear
                }

                doTransation(transition, 0)                    
            })
        }

        function state1(next){
            let i
            let q = transitions.length
            
            if (canceled) {
                return
            }
            
            for (i=0; i<transitions.length; i++) {
                // eslint-disable-next-line
                doTransation(transitions[i], 1, () => {
                    q--

                    if (q == 0) {
                        next()
                    }
                })
            }
        }

        function state2(){
            let i, transition
            
            if (canceled) {
                return
            }
            
            for (i=0; i<transitions.length; i++) {
                transition = transitions[i]
                doTransation(transition, 2)
            }
            
            setTimeout(() => clear(false, true), 1)
        }

        function clear(cancel, last = false) {
            canceled = true
            
            transitions.forEach(transition => {
                let style, cls
                let target = transition.target
                
                if (target['_stage0']) {
                    style = target['_style']
                    cls = target['_class']
                    
                    style ? target.setAttribute('style', style) : target.removeAttribute('style')
                    cls ? target.setAttribute('class', cls) : target.removeAttribute('class')
                    
                    delete (target['_stage0'])
                    delete (target['_style'])
                    delete (target['_class'])
                    delete (target['clear'])
                }

                transition.states.forEach(state => {
                    state.rule && target.classList.remove(state.rule)
                })
            })

            if  (last && complete) {
                complete(cancel)
            }
        }
    }

    /**
     * @param {Function} complete?
     */
    sequence(complete = null) {
        let index = 0
        let transitions = this._transitions
        let next = () => {
            let t = transitions[index]
            let tt

            index++

            if (t) {
                tt = csstransition(t.target, t.states)
                
                this._type == 'exit' ? tt.exit() : tt.enter()
                tt.paralell(()=>{
                    next()
                })
            } else {
                complete && complete()
            }
        }
        
        next()
    }

    /**
     * @param {Function} complete?
     */
    run(complete = null) {
        this.paralell(complete)
    }
}

/**
 * @param {{target:Element, states:Array<{prestate?:Function, rule?:String, props?:Object}>}} transition 
 * @param {Number} stateIndex 
 * @param {Function} next?
 */
function doTransation(transition, stateIndex, next = null) {
    let tm, el, states
    
    if (!transition) {
        return
    }
    
    if (!transition.states[stateIndex]) {
        return
    }

    el = transition.target
    states = transition.states

    setState(el, states[stateIndex])
    
    if (stateIndex == 1) {
        try {
            tm = getComputedStyle(el)['transitionDuration']
            tm = Math.max.apply(null, tm
                .split(',')
                .map(s => parseFloat(s.trim()) || .2)
            )
        } catch (error) {
            tm = .3
        }
        
        setTimeout(onTransitionend, tm * 1000)
    }

    function onTransitionend() {
        next()
    }
}

function setState(el, state) {
    let params = {}

    if (state.prestate) {
        state.prestate(el, params)
    }

    if (state.props) {
        Object.keys(state.props).forEach(prop => {
            let value = state.props[prop]

            if (prop == 'duration') {
                prop = 'transition-duration'
                value = (value / 1000) + 's'
                el.style['transition'] = `all ${value}`
            }
            
            el.style[prop] = replaceParams(value, params)
        })
    }
    
    add(el, state.rule)
    
    state.callback && state.callback(el)
}

function replaceParams(value, params) {
    if (typeof(value) == 'string') {
        Object.keys(params).forEach(k=>{
            value = value.replace(`{${k}}`, params[k])
        })
    }

    return value
}

function add(el, cls) {
    if (cls) el.classList.add(cls)
}

function reflow() {
    void( document.documentElement.offsetHeight )
}

export const TRANSITIONS = {
    Fade: 'Fade',
    Fall: 'Fall',
    ScaleUp: 'ScaleUp',
    HorizontalFlip3D: 'HorizontalFlip3D',
    Newspaper: 'Newspaper',
    SideFall: 'SideFall',
    Sign3D: 'Sign3D',
    SuperScale: 'SuperScale',
    SlideFromRight: 'SlideFromRight',
    SlideFromLeft: 'SlideFromLeft',
    SlideFromBottom: 'SlideFromBottom',
    SlideFromTop: 'SlideFromTop',
    Slide_StickToTop: 'Slide_StickToTop',
    VerticalFlip3D: 'VerticalFlip3D',
}

export function csstransition(target = null, statesOrName = null){
    return new CSSTransition(target, statesOrName)
}
