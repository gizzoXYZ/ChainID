/* ------------------------- External Dependencies -------------------------- */
import idx from './idx'
import React from 'react';
import { compose, lifecycle, withProps, withState, withHandlers, renderComponent } from 'recompose'
import { connect } from 'react-redux'
import { QRCode } from 'react-qr-svg'
import {
  Flex, Box, 
  Heading, Image, Paragraph, Link, Span, Button,
  BackgroundImage, BackgroundGradient, BackgroundImageIpfs
} from 'atomic'

import { 
  databaseWriteRequest,
  databaseReadRequest,
  databaseChannelRequest,
} from 'store/departments/actions'
import { fromDatabase } from 'store/departments/selectors'


/*---*--- Lifecylce Methods ---*---*/
const queryLifecycle = lifecycle({
  /*--- Component Mount ---*/
  componentDidMount() {
    this.props.requestChannel()
    // this.props.databaseReadRequest('events')
  },

  /*--- Component Update ---*/
  componentDidUpdate(prevProps) {
    
  }
})

/*---*--- Redux ---*---*/
const mapStateToProps = (state, props) => ({
  // data: fromDatabase.getDeltaData(state, 'events|search'),
  data: fromDatabase.getDeltaData(state,'events|channel'),
})
const mapDispatchToProps = (dispatch, props) => ({
  databaseReadRequest: (entity)=>dispatch(databaseReadRequest({
    payload:{},
    metadata: {
      branch: [`${entity}`],
      delta: `${entity}|search`
    } 
  })),
  requestChannel: () =>dispatch(databaseChannelRequest({
    payload: {},
    metadata: {
      branch: [
        'events'
      ],
      delta: 'events|channel',
    }
  })),
})


const ComponentRender = props => 
<div>
  {
  !props.data ? null :
  Object.keys(props.data).map(item =>
  <Flex boxShadow={0} bg='grayLight' mb={40} p={20} align="center" w={1} >
      <Box w={[1,0.5]} >
        <Heading f={[4,5]} fw="300" color="purple">
          {props.data[item].input.eventName}
        </Heading>
        <Paragraph f={[2,3]} fw="300" color="charcoal">
          {props.data[item].input.eventDescription}
        </Paragraph>
        <Paragraph f={[2,3]} fw="300" color="charcoal">
          {props.data[item].input.eventDate}
        </Paragraph>
        <Flex>
          <Box h={50} >
            <BackgroundImageIpfs src={idx(props.data[item], _=>_.images.gallery[0].data[0].hash)}/>
          </Box>
        </Flex>
      </Box>
      <Box w={[1,0.5]} p={50} >
        <Box>
          <BackgroundGradient gradient="purple" z={0} />
          <QRCode
            level="Q"
            value={idx(props, _=>_.data[item].data.QR)}
            bgColor="transparent"
            fgColor="#FFF"
            style={{ display: 'flex', width: "100%", position: 'relative', zIndex: 10 }}
          />
        </Box>
      </Box>
  </Flex>
  )}
</div>


/*-- Export Form ---*/
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  queryLifecycle,
)(ComponentRender);