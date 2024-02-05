

export const objToParams = (obj: {[key: string] : string|number|null}) => {

    const list: string[] = []

    Object.keys(obj).forEach((item)=> {
        list.push(
            `${[item]}=${obj[item]}`
        )
    })

    return "?" + list.join("&")

}
