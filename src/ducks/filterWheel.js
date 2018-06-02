import React from 'react';
import {Map,List} from 'immutable'

const _SELECT_COLOR = 'filterwheel/SELECT_COLOR';

export const InitialState = new Map( {
    selectedColor:0
})

export function selectColor(color) {
    return {type:_SELECT_COLOR, color:color};
}

export default function reducer(state = InitialState, action) {
    switch(action.type) {
        case _SELECT_COLOR: {
            return state.set('selectedColor',  action.color)
        }
    }
    return state;
}


