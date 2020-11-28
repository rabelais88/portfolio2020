import getEmoji from 'react-easy-emoji';
import React from 'react';
import emojiStyle from 'styles/emoji.module.css';

// react-easy-emoji does not support web accessibility props(aria-xxx)
// use another emoji library if possible
interface PropsEmoji {
  type: string;
  label: string;
}

const Emoji: React.FC<PropsEmoji> = ({ type, label }: PropsEmoji) => {
  const _emoji = getEmoji(type);
  return (
    <span className={emojiStyle.emoji} aria-label={label}>
      {_emoji}
    </span>
  );
};

export default Emoji;
