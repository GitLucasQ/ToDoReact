import React, { Component } from 'react'
import axios from 'axios'
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default class CreateNote extends Component {

    state = {
        users: [],
        userSelected: '',
        title: '',
        description: '',
        dateNow: new Date(),
        edit: false,
        idNote: '',
        note: []
    }

    async componentDidMount() {
        const resp = await axios.get('http://localhost:5000/api/users');
        this.setState({
            users: resp.data,
            userSelected: this.state.users[0]
        });

        const idEdit = this.props.match.params.id;

        if (idEdit) {
            const noteToEdit = await axios.get('http://localhost:5000/api/getnote/' + idEdit);
            this.setState({
                edit: true,
                idNote: idEdit,
                userSelected: noteToEdit.data[0][1],
                title: noteToEdit.data[0][2],
                description: noteToEdit.data[0][3],
                dateNow: new Date(noteToEdit.data[0][4])
            });
            console.log(this.state)
        }
    }

    onSubmit = async e => {
        e.preventDefault();
        const newNote = {
            user: this.state.userSelected,
            title: this.state.title,
            description: this.state.description,
            date: this.state.dateNow
        };

        if (this.state.edit) {
            await axios.put('http://localhost:5000/api/updateNote/' + this.state.idNote, newNote);
        }
        else {
            await axios.post('http://localhost:5000/api/newNote', newNote);
        }

        window.location.href = '/';
    }

    // selectHandler = (e) => {
    //     this.setState({ userSelected: e.target.value });
    // }

    datepickerHandler = (date) => {
        this.setState({ dateNow: date });
    }

    inputHandler = (e) => {
        this.setState({ [e.target.name]: [e.target.value] })
    }

    render() {
        return (
            <div className="row justify-content-around">
                <div className="col-6">
                    <div className="card card-body">
                        <h4>Crear nota</h4>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    name="userSelected"
                                    onChange={this.inputHandler}
                                    value={this.state.userSelected}
                                >
                                    {
                                        this.state.users.map(user =>
                                            <option
                                                key={user[0]}
                                                value={user[0]}
                                            >
                                                {user[1]}
                                            </option>)
                                    }
                                </select>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Titulo"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.inputHandler}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder="Descripción"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.inputHandler}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <Datepicker
                                    className="form-control"
                                    selected={this.state.dateNow}
                                    onChange={this.datepickerHandler}
                                    value={this.state.dateNow}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
