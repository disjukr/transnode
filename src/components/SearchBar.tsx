import React, { useState } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
}

const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const [searchText, setSearchText] = useState('');
  return <Container>
    <SearchInput
      type='text'
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
    />
  </Container>;
};

export default SearchBar;

const Container = styled('div')({
  flexBasis: '15em',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid black',
});

const SearchInput = styled('input')({
  //
});
