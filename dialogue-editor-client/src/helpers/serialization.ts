// we'll want to save scenes to be loaded by our editor and
// serialize lite versions to be loaded by the game engines

import { IReactFlow } from '../contexts/FlowContext'
import BasicNode from './BasicNode'

export function LoadScene(scene: string) {
    const out = JSON.parse(scene, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

        return matches ? Symbol.for(matches[1]) : v
    })

    return out
}

export function SaveScene(scene: object) {
    const out = JSON.stringify(scene, (k, v) =>
        typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
    )
    return out
}

export function SerializeScene(scene: IReactFlow) {
    console.log(scene)
    const out: any = {}

    scene.elements.forEach((element) => {
        const node = element as BasicNode
        if (typeof node.serialize === 'function') {
            const tmp: any = node.serialize()
            console.log('tmp is: ')
            console.log(tmp)
            const keys = Object.keys(tmp)
            keys.forEach((key) => {
                out[key] = tmp[key]
            })
        }
    })

    return JSON.stringify(out)
}
