import React, { useState, useEffect } from 'react'
import { Table, Button } from 'antd';
import ModalCreateRegistered from '../components/ModalCreateRegistered';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';

// const dataSource = [
//     {
//         id: "1",
//         title: "Teste",
//         ISBN: 2193821,
//         publicationDate: "2019-05-05",
//         genre: "ADVENTURE",
//         writerName: "Miguel",
//     }, {
//         id: "2",
//         title: "Teste",
//         ISBN: 2193821,
//         publicationDate: "2019-05-05",
//         genre: "ADVENTURE",
//         writerName: "Miguel",
//     }, {
//         id: "3",
//         title: "Livro Teste",
//         ISBN: 13412312,
//         publicationDate: "2019-05-05",
//         genre: null,
//         writerName: "Miguel",
//     }
// ]

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Time Registered',
        dataIndex: 'time_registered',
        key: 'time_registered',
    },
    {
        title: 'User',
        dataIndex: 'user.name',
        key: 'user',
    },
    {
        title: 'E-mail',
        dataIndex: 'user.email',
        key: 'user',
    },
    {
        title: 'Role',
        dataIndex: 'user.role',
        key: 'user',
    },
];

export default function Registereds() {
    const [active, setActive] = useState(false)

    const { data, loading, refetch, updateQuery } = useQuery(gql`
        query allRegistered_times {
            allRegistered_times{
                id
                time_registered
                user {
                    id
                    name
                    email
                    password
                    role
                }
            }
        } 
    `)

    useSubscription(gql`
    subscription {
        onCreateRegistereds{
            id
            time_registered
            user {
                    id
                    name
                    email
                    password
                    role
                }
        }
    }
    `, {
        onSubscriptionData({ subscriptionData }) {
            updateQuery((prev) => {
                if (!subscriptionData.data) {
                    return prev
                }
                console.log(prev)
                return Object.assign({}, prev, {
                    allRegistered_times: [
                        ...prev.allRegistered_times,
                        subscriptionData.data.onCreateRegistereds
                    ]
                })
            })
        }
    })

    useEffect(() => {
        refetch()
    }, [active, refetch])

    return (
        <>
            <Button type="primary" onClick={() => setActive(true)} style={{ marginBottom: 16 }}>
                Adicionar
            </Button>
            <Table dataSource={data && data.allRegistered_times} loading={loading} columns={columns} pagination={false} />
            <ModalCreateRegistered active={active} setActive={setActive} />
        </>
    )
}
