import React, { Component } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class NotesList extends Component {

    state = {
        notes: []
    }

    async componentDidMount() {
        this.getNotes();
    }

    getNotes = async () => {
        const rep = await axios.get('http://localhost:5000/api/notes');
        this.setState({ notes: rep.data });
    }

    showAlertDeleteNote = (id) => {
        confirmAlert({
            title: 'Confirme los cambios',
            message: '¿Está seguro de borrar la tarea?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => this.deleteNote(id)
                },
                {
                    label: 'No',
                }
            ]
        })
    }

    deleteNote = async (id) => {
        await axios.delete('http://localhost:5000/api/deleteNote/' + id);
        this.getNotes();
    }

    render() {
        return (
            <div className="row">
                {
                    this.state.notes.map(note =>
                        <div className="col-4">
                            <div className="card m-4" key={note[0]}>
                                <div className="card-body">
                                    <h5>{note[2]}</h5>
                                    <p>{note[3]}</p>
                                    <p>{format(note[4])}</p>
                                </div>
                                <div className="card-footer">
                                    <Link className="btn btn-primary" to={"/edit/" + note[0]}>
                                        Editar
                                    </Link>
                                    <button
                                        className="btn btn-danger m-2"
                                        onClick={() => this.showAlertDeleteNote(note[0])}
                                    >
                                        Eliminar
                                        </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}
