import { useHistory } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import logoImg from '../../assets/images/logo.svg';
import logoImgWhite from '../../assets/images/logoWhite.svg'

import './styles.scss';

export function RedirectLogo() {

  const history = useHistory();
  const { theme } = useTheme()

  function redirectFromPageHome() {
    history.push('/');
  }

  return(

    <div>
      {theme === 'light' ? (
        <img 
          src={logoImg} alt="Letmeask"
          className="redirect-home"
          onClick={redirectFromPageHome}
        />
      ) : (
        <img 
          src={logoImgWhite} alt="LetmeaskWhite"
          className="redirect-home"
          onClick={redirectFromPageHome}
        />
      )}
    </div>
    
  )

}