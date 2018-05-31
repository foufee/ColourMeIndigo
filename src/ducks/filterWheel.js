import React from 'react';
import {Map,List} from 'immutable'

const _LEFT = 'filterwheel/LEFT';
const _RIGHT = 'filterwheel/RIGHT';


export const InitialState = new Map( {
    selectedColor:0
})

export function left() {
    return {type:_LEFT};
}

export function right() {
    return {type:_RIGHT}
}

export default function reducer(state = InitialState, action) {
    switch(action.type) {
        case _LEFT: {
            let c = state.get('selectedColor');
            if (c == 0) {
                c = 6
            } else {
                c = c-1;
            }
            return state.set('selectedColor',  c)
        }
        case _RIGHT:
        {
            let c = state.get('selectedColor');
            if (c == 6) {
                c = 0
            } else {
                c = c+1;
            }
            return state.set('selectedColor',  c);
        }
    }
    return state;
}


