import React from 'react';
import {Map,List} from 'immutable'

const _LEFT = 'filterwheel/LEFT';
const _RIGHT = 'filterwheel/RIGHT';


export const InitialState = new Map( {
    selectedColor:0,
})

export function left() {
    return {type:_LEFT};
}

export function right() {
    return {type:_RIGHT}
}

export default function reducer(state = InitialState, action) {
    switch(action.type) {
        case _LEFT:
            return state.set('selectedColor', state.get('selectedColor') - 1);
        case _RIGHT:
            return state.set('selectedColor', (state.get('selectedColor') + 1)%7);
    }
    return state;
}


