import { useEffect, useState } from 'react'
import { useSignMessage, useSignTypedData, useSigner, useAccount } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import { decodeJwt } from 'jose'
import { useLensContext } from '../context/LensProvider'

const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`

const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`

const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }
`

export default function useLensAuthentication() {
    // wagmi hooks
    const { address, isConnected } = useAccount()

    // lens hooks
    const [verify, {}] = useLazyQuery(gql(VERIFY))
    const [generateChallenge, {}] = useLazyQuery(gql(GET_CHALLENGE))
    const { signMessageAsync } = useSignMessage()
    const [authenticate, {}] = useMutation(gql(AUTHENTICATION))
    const [refreshAuthentication, {}] = useMutation(gql(REFRESH_AUTHENTICATION))

    const {
        isLoggedIn,
        setIsLoggedIn,
        loginLoading: loading,
        setLoginLoading: setLoading,
    } = useLensContext()

    // fetch from the lens api to know if the user 'auth_token' is valid
    async function verifyAuth() {
        setLoading(true)

        // no 'auth_token' means not logged in
        if (!localStorage.getItem('auth_token')) {
            setIsLoggedIn(false)
            setLoading(false)
            return
        }

        // else we verify the 'auth_token'
        verify({
            variables: {
                request: {
                    accessToken: localStorage.getItem('auth_token'),
                },
            },
        })
            .then((data) => {
                if (data && data.data?.verify) {
                    setIsLoggedIn(true)
                    setLoading(false)
                } else {
                    setIsLoggedIn(false)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setIsLoggedIn(false)
                setLoading(false)
            })
    }

    async function login() {
        // check if the user already have an auth_token and if it's valid
        if (isLoggedIn) {
            console.log('Login: already logged in!')
            return
        }

        // check if the user's wallet is connected
        if (!isConnected) {
            console.log('Login: you need to connect your wallet first!')
            return
        }

        // we request a challenge from the server
        let message
        try {
            const data = await generateChallenge({
                variables: {
                    request: {
                        address: address,
                    },
                },
            })
            message = data.data.challenge.text
        } catch (err) {
            console.log(err)
            return
        }

        // sign the text with the wallet
        let signature
        try {
            signature = await signMessageAsync({
                message: message,
                onSuccess(signature, variables) {
                    // Verify signature when sign message succeeds
                    const recoveredAddress = verifyMessage(variables.message, signature)
                    if (recoveredAddress != address) {
                        throw new Error(
                            'Verify signature: ' + recoveredAddress + ' is != to ' + address
                        )
                    }
                },
            })
        } catch (err) {
            console.log(err)
            return
        }

        // get the authentication token
        try {
            await authenticate({
                variables: {
                    request: {
                        address: address,
                        signature: signature,
                    },
                },
                onCompleted(data) {
                    localStorage.setItem('auth_token', data.authenticate?.accessToken)
                    localStorage.setItem('refresh_token', data.authenticate?.refreshToken)
                    setAuthTokenTimeOut()
                    verifyAuth()
                },
            })
        } catch (err) {
            console.log(err)
            return
        }
    }

    function decodeAuthToken(token) {
        const decodedToken = decodeJwt(token)
        return decodedToken.exp
    }

    function setAuthTokenTimeOut() {
        const expTime = decodeAuthToken(localStorage.getItem('auth_token'))
        const nowTime = Date.now()
        const offsetTime = expTime <= nowTime ? 1 : expTime - nowTime

        setTimeout(() => {
            refreshAuth()
        }, offsetTime)
    }

    async function refreshAuth() {
        try {
            await refreshAuthentication({
                variables: {
                    request: {
                        refreshToken: localStorage.getItem('refresh_token'),
                    },
                },
                onCompleted(data) {
                    localStorage.setItem('auth_token', data.refresh?.accessToken)
                    localStorage.setItem('refresh_token', data.refresh?.refreshToken)
                    verifyAuth()
                },
            })
        } catch (err) {
            console.log(err)
            return
        }
    }

    useEffect(() => {
        if (isConnected) verifyAuth()
    }, [isConnected, isLoggedIn])

    return {
        loading,
        isLoggedIn,
        login,
    }
}
