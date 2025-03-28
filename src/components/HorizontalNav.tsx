import React from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import cockpit from 'cockpit'

interface NavBarProps {
  location: cockpit.Location;
}

export const HorizontalNav: React.FunctionComponent<NavBarProps> = ({ location }) => {
  const [activeItem, setActiveItem] = React.useState(0);
  const action = ["List", "Add"];

  const onSelect = (_event: React.FormEvent<HTMLInputElement>, result: { itemId: number | string; to: string }) => {
    setActiveItem(result.itemId as number);
    location.go(result.to);
  };

  return (
    <Nav onSelect={onSelect} variant="horizontal" aria-label="Horizontal nav local">
      <NavList>
        {action.map((value, index) => {
          return (
            <NavItem
              preventDefault
              key={index}
              itemId={index}
              isActive={activeItem === index}
              id={`horizontal-nav-${index}`}
              to={value}
            >
              {value}
            </NavItem>
          );
        })}
      </NavList>
    </Nav>
  );
};
