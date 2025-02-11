import context from './context'
import React, { useState } from 'react'

function State(props) {

    const [userExists, setUserExists] = useState(false)
    const updateExistance = ()=>{
        setUserExists(true)
    }

    const contextValues = {userExists, updateExistance}
    return (
        <context.Provider value={contextValues}>
            {props.children}
        </context.Provider>

    )
}

export default State