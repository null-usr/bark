// we'll want to save scenes to be loaded by our editor and
// serialize lite versions to be loaded by the game engines

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

export function SerializeScene() {}
