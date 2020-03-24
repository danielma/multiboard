import React from 'react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { faEye, IconDefinition } from '@fortawesome/free-regular-svg-icons';

function makeIcon(icon: IconDefinition) {
  const component = (props: Omit<FontAwesomeIconProps, 'icon'>) => (
    <FontAwesomeIcon icon={icon} {...props} />
  );

  component.displayName = icon.iconName;

  return component;
}

export default {
  Eye: makeIcon(faEye),
};
