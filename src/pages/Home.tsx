import { FormEvent, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

import { database } from '../services/firebase';

import illustration from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';


export function Home() {
    const history = useHistory();
    const {signInWithGoogle, user} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new');        
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();
        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            toast.error("Room does not exists.")
            return;
        }

        if (roomRef.val().endedAt) {
            toast.error("Room already closed.")
            return;
        }

         history.push(`/rooms/${roomCode}`);
    }

    return(
        <div id="page-auth">
            <div>
                <Toaster/>
            </div>
            <aside>
                <img src={illustration} alt="imagem de perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
                <p>Teste Deploy 2</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIcon} alt="icone do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        ou entre em uma sala 
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder="Digite o código da sala"
                        onChange={event => setRoomCode(event.target.value)}
                        value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>

        </div>
    )
}