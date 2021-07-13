import { Link, useHistory, useParams } from 'react-router-dom'

import checkImg from '../assets/images/check.svg';
import deleteImg from '../assets/images/delete.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Questions } from '../components/Question';
import { RedirectLogo } from '../components/RedirectLogo';

//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const history = useHistory();
  //generics -> parametro passado para tipagem
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const { theme, toggleTheme } = useTheme();

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        closedAt: new Date()
      });
      history.push('/');
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }
  
  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    } 
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <RedirectLogo />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
            {theme === 'light' ? (
              <Button id= "btn-theme" onClick={toggleTheme}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"/></svg></Button>
            ) : (
              <Button id="btn-theme" onClick={toggleTheme}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" fill="#ffffff"/></svg></Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {/*
            map é um método do react tem um funcionamento igual o foreach, ou seja, percorre cada item
            do question, porém, o map permite que seja retornado algo de dentro dele
            e não so itere sobre o array como o foreach. Então será percorrido cada
            item das questions e será retornado um component novo para cada um deles
          */}
          {questions.map(question => {
            return (
              <Questions
                key = {question.id}
                content = {question.content}
                author = {question.author}
                isAnswered = {question.isAnswered}
                isHighlighted = {question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Questions>
            );
          })}
          <div id="footer" className={theme}>
            <Link to={`/rooms/${roomId}`}>
              <button id="admin">Retornar a sala</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}