import React from 'react';
import styled from 'styled-components/macro';

export const Button = styled.button`
  background-color: #e6e6e6;
  border: 1px solid #9e9e9e;
  border-radius: 3px;
  padding: 0.5em 1em;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2),
    0px -1px 0px rgba(255, 255, 255, 0.4);

  &:hover {
    background-color: #f0f0f0;
  }
`;

export function Checkbox(props: React.HTMLAttributes<HTMLInputElement>) {
  const { children, ...rest } = props;
  const id = `checkbox-${children}`;
  return (
    <div>
      <input type='checkbox' id={id} {...rest} />
      <label htmlFor={id} style={{ paddingLeft: '4px' }}>
        {children}
      </label>
    </div>
  );
}

function UnstyledEmoji({
  emoji,
  label = 'emoji',
  ...rest
}: { emoji: string; label?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span role='img' aria-label={label} {...rest}>
      {emoji}
    </span>
  );
}

export const Emoji = styled(UnstyledEmoji)`
  line-height: 1em;
`;

const ListTitle = styled.h2`
  margin-bottom: 8px;
`;

const ListWrapper = styled.div`
  background-color: #ebecf0;
  border-radius: 3px;
  padding: 8px;
  width: 290px;

  display: inline-flex;
  flex-direction: column;
`;

const ListBody = styled.div`
  flex: 1;
  overflow: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  ::-webkit-scrollbar:vertical {
    width: 11px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 11px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid #ebecf0; /* should match background, can't be transparent */
    background-color: rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }
`;

const ListsContainer = styled.div`
  flex: 1;
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;

  > div {
    margin-right: 8px;
  }
`;

export const List = {
  Container: ListsContainer,
  List: ListWrapper,
  Title: ListTitle,
  Body: ListBody,
};
