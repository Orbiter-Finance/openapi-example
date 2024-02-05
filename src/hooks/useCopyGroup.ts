import { useCallback } from 'react'
import useTotas from './useTotas'
import copy from "copy-to-clipboard";

export default function useCopyGroup() {
    
	const { totasSuccess } = useTotas()


    const handleCopy = useCallback(
         (str: string) => {
            if (copy(str)) {
                totasSuccess("Copied")
            }
        },
        [totasSuccess],
    )

    return ({
        handleCopy
    })
}
