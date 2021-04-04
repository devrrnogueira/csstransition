//@ts-check

function csstransition(element, params={}){
    let isComplete = false

    const transitions = []
    const instance = {
        add(el, states) {
            if (arguments.length == 1) {
                states = el
                el = element
            }

            if (!el) {
                return instance
            }

            states = Array.isArray(states) ? states : [null, states]

            transitions.push({
                element: el,
                states: states.map((s) => {
                    let o = JSON.parse(JSON.stringify(typeof (s) == 'string' ? {rule: s} : {...s}))

                    if (o) {
                        o.prestate = s ? s.prestate : null

                        if (o.rule) {
                            o.rule = replaceParams(o.rule, params)
                        }
                        
                        if (o.props) {
                            Object.keys(o.props).forEach(p=>{
                                o.props[p] = replaceParams(o.props[p], params)
                            })
                        }
                    }
                    
                    return o
                })
            })

            return instance
        },
        paralell(complete) {
            let canceled = false

            state0()
            reflow()
            setTimeout(()=>{
                state1(state2)
            },1)

            function state0(){
                if (canceled) {
                    return
                }

                transitions.forEach(({element}) => {
                    if (element.clear) {
                        element.clear(true)
                    }
                })

                transitions.forEach((transition) => {
                    let el = transition.element
    
                    if (!el._stage0) {
                        el._stage0 = true
                        el._cssText = el.style.cssText
                        el._class = el.getAttribute('class')
                        el.clear = clear
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
                    doTransation(transitions[i], 1, ()=>{
                        q--
                        if (q==0) {
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
                
                setTimeout(clear,1)
            }

            async function clear(cancel) {
                let i, el, transition

                canceled = true

                for (i=0; i<transitions.length; i++) {
                    transition = transitions[i]
                    el = transition.element
                    
                    if (el._stage0) {
                        el.style.cssText = el._cssText
                        el._class ? el.setAttribute('class', el._class) : el.removeAttribute('class')
                        
                        delete(el._stage0)
                        delete(el.clear)
                        delete(el._cssText)
                        delete(el._class)
                    }
                }

                if (!isComplete){
                    isComplete = true
                    complete && complete(cancel)
                }
            }
        },
        sequence(complete) {
            let index = 0
            
            next()

            function next() {
                let t = transitions[index]

                index++

                if (t) {
                    csstransition(t.element, params)
                        .add(t.states)
                        .paralell(()=>{
                            next()
                        })
                } else {
                    complete && complete()
                }
            }

        },
        run(states, complete = null) {
            instance.add(states).paralell(complete)
        }
    }

    return instance
}

function doTransation(transition, state, resolve) {
    let tm, el, states
    let resolved = false
    
    if (!transition) {
        return
    }
    
    if (!transition.states[state]) {
        return
    }

    el = transition.element
    states = transition.states

    setState(el, states[state])

    if (state == 1) {
        try {
            tm = parseFloat(getComputedStyle(el)['transitionDuration']) || 0.2
        } catch (error) {
            tm = 0.2
        }
        
        el.addEventListener('transitionend', onTransitionend)
        setTimeout(onTransitionend, tm * 1000)
    }

    function onTransitionend() {
        el.removeEventListener('transitionend', onTransitionend)

        if (!resolved) {
            resolved = true
            resolve()
        }
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

export default csstransition
