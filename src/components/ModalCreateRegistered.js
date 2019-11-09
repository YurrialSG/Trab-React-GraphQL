import React from 'react'
import { Modal, Form, Input, Icon, notification } from 'antd';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

function ModalCreateRegistered({ active, setActive, form: { getFieldDecorator, validateFields, resetFields } }) {

    const [mutate, { loading }] = useMutation(gql`
        mutation createRegistered_time($data: CreateRegistered_timeInput!) {
            createRegistered_time(data: $data) {
                time_registered
                user {
                    name
                    email
                    password
                    role
                }
            }
        }
    `)

    function onModalSubmit() {
        validateFields(async (err, values) => {
            if (!err) {
                const user = JSON.parse(localStorage.getItem('user'))

                const { data, errors } = await mutate({
                    variables: {
                        data: {
                            ...values,
                            user: {
                                id: +user.id
                            }
                        }
                    }
                })
                if (!errors) {
                    notification.success({
                        message: `Registro ${data.createRegistered_time.time_registered} cadastrado`
                    })
                    setActive(false)
                    resetFields()
                }
            }

        })
    }
    console.log(active)

    return (
        <Modal
            title="Time Registered"
            visible={active}
            onOk={onModalSubmit}
            confirmLoading={loading}
            onCancel={() => setActive(false)}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('time_registered', {
                        rules: [{ required: true, message: 'Digite o time registered' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Time Registered"
                            type="number"
                        />,
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Form.create({ name: 'create-registered_time' })(ModalCreateRegistered)