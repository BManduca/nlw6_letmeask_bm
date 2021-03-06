import { ReactNode } from 'react';
import cn from 'classnames';

import './styles.scss';

type QuestionsProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Questions({
  content, 
  author,
  isAnswered = false,
  isHighlighted = false,
  children
}: QuestionsProps) {

  return (
    // <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`}>
    <div 
      className={cn(
        'question',
        {answered: isAnswered},
        {highlighted: isHighlighted && !isAnswered}
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );

}