import React from 'react'
import { Form, Icon, Input, Button } from 'antd';
import { Link, useHistory } from 'react-router-dom'
import './Login.scss'
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
function Login({ form: { getFieldDecorator, validateFields, setFields } }) {
    const history = useHistory()

    const [mutate] = useMutation(gql`
        mutation signin($email: String! $password: String!) {
            signin(email: $email password: $password) {
                token
                user {
                    id
                    name
                    email
                    role
                }
            }
        }
    `)

    function handleSubmit(e) {
        e.preventDefault()

        validateFields(async (err, values) => {
            if (!err) {
                const { data } = await mutate({
                    variables: {
                        email: values.email,
                        password: values.password
                    }
                })
                if (!data.signin) {
                    setFields({
                        email: {
                            value: values.email,
                            errors: [new Error('')]
                        },
                        password: {
                            value: values.password,
                            errors: [new Error('E-mail ou senha inválida')]
                        },
                    })
                    return
                }

                if (data.signin.token) {
                    localStorage.setItem('token', data.signin.token)
                    localStorage.setItem('user', JSON.stringify(data.signin.user))
                    history.push('/registereds')
                    return
                }
            }
        })

    }

    return (
        <div className="login-wrapper">
            <Form onSubmit={handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please input your email!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="E-mail"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <div className="justify-between">
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or
                    <Link to="/register">register now!</Link>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );

}

export default Form.create({ name: 'login' })(Login)