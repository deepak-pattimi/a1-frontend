import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Head({ children }) {
  return <Helmet>{React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === 'script' && child.props.dangerouslySetInnerHTML) {
      const { dangerouslySetInnerHTML, ...props } = child.props;
      return <script {...props}>{dangerouslySetInnerHTML.__html}</script>;
    }
    return child;
  })}</Helmet>;
}
