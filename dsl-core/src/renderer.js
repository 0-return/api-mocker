import R from 'ramda'
import { compile, debugCompile } from './compiler'

function renderer (inject, debug = false) {
    return function (obj){
        if (debug) {
            console.log('renderer: ', obj)
        }
        const compile = debug ? debugCompile : compile
        const answer = R.map(function (renderArray) {
            return R.reduce(function (oripattern, item) {
                if (typeof item.pattern === 'string')
                    return oripattern.replace(item.model, inject[item.pattern])
                else
                    return oripattern.replace(item.model, item.pattern)
            }, R.head(renderArray).oripattern, renderArray)
        },compile(obj))

        return R.reduce(function (result, pair) {
            const path = R.split('.', R.head(pair))
            const value = R.last(pair)
            return R.assocPath(path, value, result)
        }, obj, R.toPairs(answer))
    }
}

console.log(renderer({id: 'wo'},true)({
    one: '${id}world'
}))
export default renderer



