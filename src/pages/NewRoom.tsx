import {Link, useHistory} from 'react-router-dom';
import { useState, FormEvent } from 'react';

import { database } from '../services/firebase';
import {useAuth} from '../hooks/useAuth';


import { Button } from '../components/Button';

import '../styles/auth.scss';

import illustration from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';


export function NewRoom() {
     const { user } = useAuth();
     const history = useHistory();

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();
        
        if (newRoom.trim() === ''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${firebaseRoom.key}`)


    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustration} alt="imagem de perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <h2>Crie uma nova sala</h2>
                    
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text" 
                        placeholder="Nome da sala"
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>

                    <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link></p>
                
                </div>
            </main>

        </div>
    )
}