import React, { Component } from 'react'
import axios from 'axios'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class CreateUser extends Component {

    state = {
        users: [],
        username: ''
    }

    async componentDidMount() {
        this.getUsers();
        console.log(this.state.users);
    }

    async getUsers() {
        const resp = await axios.get('http://localhost:5000/api/users');
        this.setState({ users: resp.data })
    }

    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    onSubmit = async e => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/newUser', { username: this.state.username });
        this.getUsers();
        this.state.username = ''
    }

    showAlert = (id) => {
        confirmAlert({
            title: 'Confirme los cambios',
            message: '¿Está seguro de borrar el usuario?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => this.deleteUser(id)
                },
                {
                    label: 'No',                    
                }
            ]
        })        
    }

    deleteUser = async (id) => {
        console.log(id);
        await axios.delete('http://localhost:5000/api/deleteUser/' + id);
        this.getUsers();
    }

    render() {
        return (
            <div className="row justify-content-around">
                <div className="col-4 p-3">
                    <div className="card card-body">
                        <h4>Crea un nuevo usuario</h4>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={this.state.username}
                                    className="form-control"
                                    onChange={this.onChangeUsername}
                                />
                            </div>
                            <button className="btn btn-success" type="submit">Guardar</button>
                        </form>
                    </div>
                </div>
                <div className="col-4 p-3">
                    <ul className="list-group">
                        {
                            this.state.users.map(user => (
                                <li
                                    className="list-group-item list-group-item-action"
                                    key={user[0]}
                                    onDoubleClick={() => this.deleteUser(user[0])}
                                >
                                    <div className="row justify-content-around">
                                        <div className="col-6">
                                            <p>{user[1]}</p>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => this.showAlert(user[0])}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
