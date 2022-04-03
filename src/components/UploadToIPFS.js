import React, { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export const FileUpload = ({ setUrl }) => {
    const [file, setFile] = useState({})
    const [fileUrl, setFileUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const uploadFile = async () => {
        setLoading(true)
        try {
            const added = await ipfs.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setUrl(url)
            setFileUrl(url)
            setUploaded(true)
        } catch (err) {
            console.log('Error uploading the file : ', err)
        }
        setLoading(false)
    }

    const preUpload = (e) => {
        if (e.target.value !== '') {
            setFile(e.target.files[0])
        } else {
            setFile({})
        }
    }

    const fileAndUploadButton = () => {
        if (file.name) {
            if (!loading) {
                return (
                    <div>
                        <h5>
                            {file.name}
                        </h5>
                        {uploaded ? (
                            <h5>

                                <a
                                    href={fileUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    File
                                </a>
                                Uploaded Successfully
                            </h5>
                        ) : (
                            <button onClick={() => uploadFile()}>Upload File</button>
                        )}
                    </div>
                )
            } else {
                return (
                    <div>
                        <h4>Uploading File</h4>

                        <h4>Please Wait ...</h4>
                    </div>
                )
            }
        }
    }

    return (
        <div>

            <input

                type='file'
                onChange={(e) => preUpload(e)}
                className='mb-3'
            />

            {fileAndUploadButton()}

        </div>
    )
}