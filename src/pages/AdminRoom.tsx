//React
import { useHistory, useParams } from 'react-router-dom';

//Components
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

//Styles and images
import '../styles/room.scss';
import '../styles/question.scss'

import logoimg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

//hooks
import { useRoom } from '../hooks/useRoom';
// import { useAuth } from '../hooks/useAuth';

//services
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom(){
    //const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();

    const roomId = params.id
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }
    
    async function handleQuestionAnswered(QuestionId: string) {
        await database.ref(`rooms/${roomId}/questions/${QuestionId}`).update({
            isAnswered: true, 
        });
        
        
    }
    async function handleHighlightQuestion(QuestionId: string) {
        await database.ref(`rooms/${roomId}/questions/${QuestionId}`).update({
            isHighlighted: true, 
        });
        
    }
    async function handleDeleteQuestion(QuestionId: string) {
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${QuestionId}`).remove();
        }
        
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoimg} alt="Letmeask"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span> } 
                </div>
                <div className="question-list">
                {questions.map(question => {
                    return(
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >   
                            {!question.isAnswered && (
                                <>
                                <button
                                    type="button"
                                    onClick={() => handleQuestionAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Dar destaque a pergunta" />
                                </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="remover pergunta" />
                            </button>
                        </Question>
                    )
                })}
                </div>

            </main>
        </div>
    )
}