/**
 *
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
export function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
}