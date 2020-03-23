import styled from 'styled-components/macro';

export const labelColors = {
  yellow: '#f3d603',
  green: '#60bd4f',
  pink: '#ff78cb',
  red: '#eb5b46',
  black: '#354563',
  purple: '#c477e0',
  blue: '#0679bf',
};

export const LabelPill = styled.li<{
  color: TrelloLabelColor;
  focused?: boolean;
}>`
  display: inline-block;
  border-radius: 4px;
  min-height: 8px;
  min-width: 36px;
  color: white;
  background-color: ${(p) => labelColors[p.color]};
  font-weight: bold;
  text-align: center;
  padding: 2px 6px;
  margin-right: 4px;
  margin-bottom: 4px;
  cursor: pointer;

  ${(p) => p.focused === false && `opacity: 0.4`}
`;

const Labels = styled.ul<{ showLabelText: boolean }>`
  overflow: auto;
  font-size: ${(p) => (p.showLabelText ? '10px' : 0)};
`;

export default Labels;
