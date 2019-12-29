import React, { useState } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';

import fuzzysearch from '../misc/fuzzysearch';
import { builtInCapsules } from '../state/document';

interface SearchBarProps {
}

const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const [searchText, setSearchText] = useState('');
  return <Container>
    <SearchInput
      type='text'
      value={searchText}
      placeholder='search'
      onChange={e => setSearchText(e.target.value)}
    />
    <CapsuleList>
      {builtInCapsules.filter(({ name }) => fuzzysearch(searchText, name)).map(
        ({ id, name }) => <CapsuleItem key={id} name={name}/>
      )}
    </CapsuleList>
  </Container>;
};

export default SearchBar;

const Container = styled('div')({
  flexBasis: '15em',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid black',
});

const SearchInput = styled('input')({});

const CapsuleList = styled('ul')({
  flexGrow: 1,
  overflowY: 'scroll',
});

interface CapsuleItemProps {
  name: string;
}
const CapsuleItem: React.FC<CapsuleItemProps> = ({ name }) => {
  const [, drag] = useDrag({
    item: { type: 'capsule' },
  });
  return <li
    ref={drag}
    style={{ height: '2em', border: '1px solid black' }}>
    { name }
  </li>;
};
