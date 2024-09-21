import React from 'react'
import LayoutContainer from '../../components/LayoutContainer'
import { useParams } from 'react-router-dom';
import ListFile from './components/ListFile';

const DetailFolder = () => {
    const {name ,id } = useParams();

  return (
    <LayoutContainer title={name}>
      <ListFile id={id} />

    </LayoutContainer>
  )
}

export default DetailFolder
